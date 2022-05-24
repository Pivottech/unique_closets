# Copyright (c) 2022, PivotERP and contributors
# For license information, please see license.txt

import frappe
from googletrans import Translator

@frappe.whitelist()
def translate(text ,dest="en"):
    google_transalte = Translator()
    res = google_transalte.translate("اسمي {0}".format(text), dest)
    str = res.text.upper()
    name = str.split("IS",1)[1]
    return name.strip().title()