import frappe 
from frappe.utils import flt
from erpnext.stock.get_item_details import get_price_list_rate_for
import json


@frappe.whitelist()
def calculate_component_total(args, item, sales_order, default_material):
    args = json.loads(args)
    sales_order = json.loads(sales_order)
    base_price = 0
    additional_price = 0
    if "width" in args and "height" in args:
        base_price = calculate_dimensions_total(sales_order, item, args["width"], args["height"])
        if "sections" in args:
            additional_price += calculate_sections_additions(base_price, args["sections"])

    else: 
        base_price = get_price_list_rate_for({
            "item_code": item,
            "price_list": "Standard Selling",
            "transaction_date": sales_order["transaction_date"],
            "customer": sales_order["customer"]
        }, item)
    #calc material
    if "material" in args:
        percent = frappe.db.get_value("Material", args["material"], "gross_percent") 
        base_price *= flt(percent)+1
    elif default_material:
        percent = frappe.db.get_value("Material", default_material, "gross_percent")
        base_price *= flt(percent)+1

    # calc additions
    additional_items = []
    if "additions" in args:
        for a in args["additions"]:
            additional_items.append(a["item"])
    if "specialty" in args:
        additional_items.append(args["specialty"])
    if "handles" in args:
        additional_items.append(args["handles"])
    additional_price += calculate_additional_items(additional_items, sales_order)
    return base_price , additional_price



def calculate_dimensions_total(sales_order ,item, width, height):
    sqm_item_price = get_price_list_rate_for({
        "item_code": item,
        "price_list": "Standard Selling",
        "uom": "SQM",
        "transaction_date": sales_order["transaction_date"],
        "customer": sales_order["customer"]
    }, item)
    if sqm_item_price:
        return flt(width) * flt(height) /10000 * sqm_item_price
    else: 
        return 0

def calculate_additional_items(items, sales_order):
    total_additions = 0
    for i in items:  
        item_price = get_price_list_rate_for({
            "item_code": i,
            "price_list": "Standard Selling",
            "transaction_date": sales_order["transaction_date"],
            "customer": sales_order["customer"]
        }, i)
        total_additions += flt(item_price)
    return total_additions

def calculate_sections_additions(base_price, sections):
    additionals = 0
    for section in sections:
        gross_percent = frappe.db.get_value("Material", section["material"], "gross_percent")
        section_base_price = base_price * flt(section["coverage_percentage"])/100
        additionals += section_base_price* (flt(gross_percent))
    return additionals
        

