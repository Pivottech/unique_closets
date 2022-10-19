import frappe
from frappe.desk.reportview import get_match_cond, get_filters_cond
from frappe.utils import nowdate, getdate

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def item_by_group_query(doctype, txt, searchfield, start, page_len, filters, as_dict=False):
	conditions = []
	lft, rgt = frappe.db.get_value("Item Group", filters.get('item_group_parent'), ["lft", "rgt"])
	groups = frappe.get_list("Item Group", filters={"lft":[">", lft], "rgt": ["<", rgt]}, pluck="name")
	del filters["item_group_parent"]

	if isinstance(filters, str):
		filters = json.loads(filters)

	# Get searchfields from meta and use in Item Link field query
	meta = frappe.get_meta("Item", cached=True)
	searchfields = meta.get_search_fields()

	# these are handled separately
	ignored_search_fields = ("item_name", "description")
	for ignored_field in ignored_search_fields:
		if ignored_field in searchfields:
			searchfields.remove(ignored_field)

	columns = ""
	extra_searchfields = [
		field
		for field in searchfields
		if not field in ["name", "item_group", "description", "item_name"]
	]

	if extra_searchfields:
		columns = ", " + ", ".join(extra_searchfields)

	searchfields = searchfields + [
		field
		for field in [searchfield or "name", "item_code", "item_group", "item_name"]
		if not field in searchfields
	]
	searchfields = " or ".join([field + " like %(txt)s" for field in searchfields])

	if filters and isinstance(filters, dict):
		if filters.get("customer") or filters.get("supplier"):
			party = filters.get("customer") or filters.get("supplier")
			item_rules_list = frappe.get_all(
				"Party Specific Item", filters={"party": party}, fields=["restrict_based_on", "based_on_value"]
			)

			filters_dict = {}
			for rule in item_rules_list:
				if rule["restrict_based_on"] == "Item":
					rule["restrict_based_on"] = "name"
				filters_dict[rule.restrict_based_on] = []

			for rule in item_rules_list:
				filters_dict[rule.restrict_based_on].append(rule.based_on_value)

			for filter in filters_dict:
				filters[scrub(filter)] = ["in", filters_dict[filter]]

			if filters.get("customer"):
				del filters["customer"]
			else:
				del filters["supplier"]
		else:
			filters.pop("customer", None)
			filters.pop("supplier", None)

	description_cond = ""
	if frappe.db.count("Item", cache=True) < 50000:
		# scan description only if items are less than 50000
		description_cond = "or tabItem.description LIKE %(txt)s"
	return frappe.db.sql(
		"""select
			tabItem.name, tabItem.item_name, tabItem.item_group,
		if(length(tabItem.description) > 40, \
			concat(substr(tabItem.description, 1, 40), "..."), description) as description
		{columns}
		from tabItem
		where tabItem.docstatus < 2
			and tabItem.disabled=0
			and tabItem.has_variants=0
			and tabItem.item_group in %(groups)s
			and (tabItem.end_of_life > %(today)s or ifnull(tabItem.end_of_life, '0000-00-00')='0000-00-00')
			and ({scond} or tabItem.item_code IN (select parent from `tabItem Barcode` where barcode LIKE %(txt)s)
				{description_cond})
			{fcond} {mcond}
		order by
			if(locate(%(_txt)s, name), locate(%(_txt)s, name), 99999),
			if(locate(%(_txt)s, item_name), locate(%(_txt)s, item_name), 99999),
			idx desc,
			name, item_name
		limit %(start)s, %(page_len)s """.format(
			columns=columns,
			scond=searchfields,
			fcond=get_filters_cond(doctype, filters, conditions).replace("%", "%%"),
			mcond=get_match_cond(doctype).replace("%", "%%"),
			description_cond=description_cond,
		),
		{
			"today": nowdate(),
			"txt": "%%%s%%" % txt,
			"_txt": txt.replace("%", ""),
			"start": start,
			"page_len": page_len,
			"groups": groups
		},
		as_dict=as_dict,
	)