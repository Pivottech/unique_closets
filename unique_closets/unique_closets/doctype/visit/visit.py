# Copyright (c) 2022, PivotERP and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Visit(Document):
	def validate(self):
		self.update_visit_status()
	def update_visit_status(self):
		tasks = frappe.get_list("Task", filters={"appointment": self.name}, pluck = "name")
		for t in tasks:
			frappe.db.set_value("Task", t, "appointment_status", self.status)
