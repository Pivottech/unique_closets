from . import __version__ as app_version

app_name = "unique_closets"
app_title = "Unique Closets"
app_publisher = "PivotERP"
app_description = "Overrides and customizations on erpnext for uc company "
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "osama.ereksosi@pivoterp.net"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/unique_closets/css/unique_closets.css"
app_include_js = ["/assets/unique_closets/js/customer_quick_entry.js"]

# include js, css files in header of web template
# web_include_css = "/assets/unique_closets/css/unique_closets.css"
# web_include_js = "/assets/unique_closets/js/unique_closets.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "unique_closets/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
doctype_js = {"Sales Order" : "public/js/sales_order.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "unique_closets.install.before_install"
# after_install = "unique_closets.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "unique_closets.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

override_doctype_class = {
	"Project": "unique_closets.overrides.UCProject",
	"Task": "unique_closets.overrides.UCTask",
	"Customer": "unique_closets.overrides.UCCustomer",
	"Sales Order": "unique_closets.overrides.UCSalesOrder"
}

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"unique_closets.tasks.all"
# 	],
# 	"daily": [
# 		"unique_closets.tasks.daily"
# 	],
# 	"hourly": [
# 		"unique_closets.tasks.hourly"
# 	],
# 	"weekly": [
# 		"unique_closets.tasks.weekly"
# 	]
# 	"monthly": [
# 		"unique_closets.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "unique_closets.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "unique_closets.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "unique_closets.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

user_data_fields = [
	{
		"doctype": "{doctype_1}",
		"filter_by": "{filter_by}",
		"redact_fields": ["{field_1}", "{field_2}"],
		"partial": 1,
	},
	{
		"doctype": "{doctype_2}",
		"filter_by": "{filter_by}",
		"partial": 1,
	},
	{
		"doctype": "{doctype_3}",
		"strict": False,
	},
	{
		"doctype": "{doctype_4}"
	}
]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"unique_closets.auth.validate"
# ]

