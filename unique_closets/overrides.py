from erpnext.projects.doctype.project.project import Project
from erpnext.projects.doctype.task.task import Task
from erpnext.selling.doctype.customer.customer import Customer
from unique_closets.unique_closets.utils import translate
import frappe

class UCProject(Project):
    def create_task_from_template(self, task_details):
        return frappe.get_doc({
            "doctype": "Task",
            "subject": task_details.subject,
            "project": self.name,
            "status": "Open",
            "exp_start_date": self.calculate_start_date(task_details),
            "exp_end_date": self.calculate_end_date(task_details),
            "description": task_details.description,
            "task_weight": task_details.task_weight,
            "type": task_details.type,
            "issue": task_details.issue,
            "is_group": task_details.is_group,
            "task_template": task_details.name,
            "models_status_condition": task_details.models_status_condition
        }).insert()
    def get_appointment_tasks_from_template(self):
        result = []
        appointment_task_templates = frappe.get_list("Project Template Task", filters= {"parent": self.project_template, "need_visit": True}, fields = ["task", "work_type"])
        for att in appointment_task_templates:
            result += frappe.get_list("Task", filters={"task_template": att.task, "project": self.name}, fields = ["name", "'%s' as work_type"%(att.work_type)])
        return result

    def on_trash(self):
        super(UCProject, self).on_trash()
        frappe.db.sql("delete from `tabTask` where project = '%s'"% self.name)
        frappe.db.sql("delete from `tabVisit` where project = '%s'"% self.name)
        frappe.db.sql("delete from `tabModel` where project = '%s'"% self.name)

class UCTask(Task):
    def validate_status(self):
        if self.status!=self.get_db_value("status") and self.status == "Completed":
            if self.task_template:
                task_template = frappe.get_doc("Task", self.task_template)
                for r in task_template.references:
                    l = frappe.get_list("Task Reference", filters = {"parent": self.name, "reference_type": r.reference_type, "status": r.status}, fieldname = ["name"])
                    if not l:
                        frappe.throw("%s %s in Template Task is not exist in this task" %(r.reference_type, r.status))
        super(UCTask, self).validate_status()

class UCCustomer(Customer):
    def validate(self):
        super(UCCustomer, self).validate()
        self.validate_english_name()
    
    def validate_english_name(self):
        if not self.customer_name_in_english:
            self.customer_name_in_english = translate(self.customer_name)




