# Copyright (c) 2021, PivotERP and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ComponentItem(Document):
	pass

@frappe.whitelist()
def get_components(item_code, area):
	item_comps = frappe.get_list("Component Item", filters = {"item_code": item_code, "area": ["<=", area]}, fields=["name"], order_by ="area desc")
	if item_comps:
		item_comp = frappe.get_doc("Component Item", item_comps[0].name)
		return item_comp.items




