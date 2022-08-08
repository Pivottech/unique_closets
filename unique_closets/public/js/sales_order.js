var cur_dialog_idx = -1;
frappe.ui.form.on('Sales Order', {
    onload: function(frm){
        var edit_btn = frm.fields_dict.items.grid.add_custom_button("Create Item", function(){
            frm.events.create_item(frm);
        });
        edit_btn.removeClass();
        edit_btn.addClass("btn btn-xs btn-secondary grid-add-row");
        edit_btn.css({"margin-right": "4px", "display": "inline-block"});
        frm.fields_dict.items.$wrapper.on('click', '.grid-row-check', (e) => {
            if(frm.get_selected()["items"]){
                edit_btn[0].innerHTML = "Edit Item";
            }
            else{
                edit_btn[0].innerHTML = "Create Item";
                frm.set_df_property("create_item", "label", "Create Item");
            }
        });
    },
    create_item: function (frm) {
        var selected_items = frm.get_selected()["items"];
        if(selected_items){
            create_item_dialog(frm, "Sales Order Item", selected_items[0]);
        }
        else{
            create_item_dialog(frm);
        }
    },
	create_customer: function(frm){
	    let d = new frappe.ui.Dialog({
	        title:"Create New Customer",
	        fields:[
	            {
	                label: "Full Name",
	                fieldtype: "Data",
	                fieldname: "customer_name"
	            },
	            {
	                label: "Type",
	                fieldname: "customer_type",
	                fieldtype: "Select",
	                translatable: 1,
	                options: ["Company", "Individual"],
	                default: "Individual"
	            },
	            {
	                label: "Customer Group",
	                fieldname: "customer_group",
	                fieldtype: "Link",
	                translatable: 1,
	                options: "Customer Group",
	                default: "Individual"
	            },
	            {
	                label: "Territory",
	                fieldname: "territory",
	                fieldtype: "Link",
	                options: "Territory",
	                translatable: 1,
	                default: "Saudi Arabia"
	            },
	            {
	                fieldtype: "Section Break",
	                label: "Primary Contact Details"
	            },
	            {
	                label: "Mobile No",
	                fieldname: "mobile_no",
	                fieldtype: "Data"
	            },
	            {
	                fieldtype: "Column Break"
	            },
	            {
	                label: "Email Id",
	                fieldname: "email_id",
	                fieldtype: "Data"
	            },
	            {
	                fieldtype: "Section Break",
	                label: "Project Address Details"
	            },
	            {
	                label: "State",
	                fieldname: "state",
	                fieldtype: "Data",
	                translatable: 1,
	                default: "Riyadh State",
	            },
	            {
	                label: "City",
	                fieldname: "city",
	                fieldtype: "Data",
	                translatable: 1,
	                default: "Riyadh",
	            },
	            {
	                label: "District",
	                fieldname: "district",
	                fieldtype: "Link",
	                options: "District"
	            },
                {
	                label: "Address Category",
	                fieldname: "address_category",
                    fieldtype: "Select",
                    translatable: 1,
	                options: ["Appartment","Villa","Compound","Palace"],
	                default: "Appartment",
                },
	            {
	                label: "ZIP Code",
	                fieldname: "pincode",
	                fieldtype: "Data",
	            },
	            {
	                label: "Building Number",
	                fieldname: "building_number",
	                fieldtype: "Data",
	            },
	            {
	                fieldtype: "Column Break"
	            },
	            {
	                label: "Country",
	                fieldname: "country",
	                fieldtype: "Link",
	                options: "Country",
	                translatable: 1,
	                default: "Saudi Arabia"
	            },
	            {
	                label: "Address Line1",
	                fieldname: "address_line1",
	                fieldtype: "Small Text",
	            },
	            {
	                label: "Address Line2",
	                fieldname: "address_line2",
	                fieldtype: "Small Text",
	            },
	            {
	                label: "Unite Number",
	                fieldname: "unite_number",
	                fieldtype: "Data",
	            },
	            {
	                fieldtype: "Section Break"
	            },
	            {
	                label: "Rooms",
	                fieldtype: "Table",
	                fieldname: "rooms",
	                fields:[
	                    {
	                        label: "Description",
	                        fieldname: "description",
	                        fieldtype: "Data",
	                        in_list_view: 1
	                    },
	                    {
	                        label: "Floor No",
	                        fieldname: "floor_no",
	                        fieldtype: "Data",
	                        in_list_view: 1
	                    },
	                    {
	                        label: "Paint Color",
	                        fieldname: "paint_color",
	                        fieldtype: "Color",
	                    },
	                    {
	                        label: "Length M",
	                        fieldname: "length",
	                        fieldtype: "Float"
	                    },
	                    {
	                        label: "Width M",
	                        fieldname: "width",
	                        fieldtype: "Float"
	                    },
	                    {
	                        label: "Height M",
	                        fieldname: "height",
	                        fieldtype: "Float"
	                    }
	                    ]
	            }
	            ],
	            primary_action_label: "Submit",
	            primary_action: function(values){
	                let customer = frappe.db.insert({
	                    doctype: "Customer",
	                    customer_name: values.customer_name,
	                    customer_type: values.customer_type,
	                    customer_group: values.customer_group,
	                    territory: values.territory,
	                    email_id: values.email_id,
	                    mobile_no: values.mobile_no,
	                }).then(doc=>{
	                    frappe.db.insert({
	                    doctype: "Address",
	                    address_line1: values.address_line1,
	                    address_line2: values.address_line2,
	                    city: values.city,
	                    pincode: values.pincode,
	                    state: values.state,
	                    country: values.country,
	                    address_title: customer.name,
	                    address_category: values.address_category,
	                    building_number :values.building_number,
	                    unite_number :values.unite_number,
	                    district: values.district,
	                    links: [{
	                        link_doctype: "Customer",
	                        link_name: doc.name,
	                        link_title: doc.customer_name
	                        }]
	                    }).then(add =>{
	                        values.rooms.forEach(room =>{
    	                        frappe.db.insert({
        	                        doctype: "Customer Room",
        	                        address: add.name,
        	                        customer: doc.name,
        	                        paint_color: room.paint_color,
        	                        description: room.description,
        	                        length: room.length,
        	                        width: room.width,
        	                        height: room.height,
        	                        floor_no: room.floor_no
        	                        
    	                        });
	                        });
	                    });
	                    frm.set_value("customer", doc.name);
	                });
	                d.hide();
	            }
	    });
	    d.show();
	    
	},
	refresh: function(frm){
	   frappe.db.get_list("Project", {
	       filters: {
	           sales_order: frm.doc.name
	       },
	       fields: ["name"]
	   }).then(rec =>{
	       if (rec.length == 0){
	           let btn = frm.page.set_secondary_action('Create Project', function(){
	        var d = new frappe.ui.Dialog({
	            title: "Create Project",
	            fields: [
	                {
	                label: "Project Template",
	                fieldname: "project_template",
	                fieldtype: "Link",
	                options: "Project Template"
	                }
	           ],
	           primary_action_label: "Submit",
	           primary_action: function(values){
	               frappe.call({
	                   method: "create_project_for_sales_order",
	                   args:{
	                       project_template: values.project_template,
	                       customer: frm.doc.customer,
	                       sales_order: frm.doc.name,
	                       models: frm.doc.items,
	                       project_name: frm.doc.customer + "-" + frm.doc.name
	                   }
	               });
	               d.hide();
	           }
	        });
	        d.show();
	    });
	       }
	   });
	}
});


frappe.ui.form.on("Sales Order Item",{
    "material_gross": function(frm, cdt, cdn){
        var row = locals[cdt][cdn];
        row.rate *= (row.material_gross + 1);
        var comps = JSON.parse(row.component_json);
        var total = 0;
        for (var i=0; i<comps.length; i++){
            total += parseFloat(comps[i].qty)* parseFloat(comps[i].price);
        }
        row.rate += total/row.qty;
        frm.refresh_field("items");
    },
    "edit_model": function(frm, cdt, cdn){
        create_item_dialog(frm, cdt, cdn);
    }
});
function get_components(item_code, area){
    var str = "<h3>Free Items<h3>";
    frappe.call({
        method: "unique_closets.unique_closets.doctype.component_item.component_item.get_components",
        args: {
            'item_code': item_code,
            'area': area,
        },
        callback: function(r){
            if(r.message){
                r.message.forEach(item => {str+= "<h6>"+item.item_code + " Qty     "+item.qty+ "</h6>";});
            }
        },
        async: false
    });
    return str;
}

function create_item_dialog(frm, cdt = null, cdn = null) {
    var comp_data = [];
    if (cdt && cdn){
        if(locals[cdt][cdn].component_json){
            comp_data = JSON.parse(locals[cdt][cdn].component_json);
        }
    }
    let d = new frappe.ui.Dialog({
        title : "Components",
        minimizable: 1,
        size: "extra-large",
        fields : [
            {
                label: "Row",
                fieldtype: "Int",
                fieldname: "row",
                read_only: 1,
                hidden: 1,
            },
            {
                label: "Item",
                fieldname: "item_code",
                fieldtype: "Link",
                options: "Item",
                change: function(){
                    if(d.get_value("item_code"))
                    {
                        frappe.call({
                            method: "erpnext.stock.get_item_details.get_item_details",
                            args:{
                                args:{
                                    "item_code": d.get_value("item_code"),
                                    "company": frm.doc.company,
                                    "doctype": "Sales Invoice",
                                    "price_list": "Standard Selling",
                                    "conversion_rate": 1,
                                    "customer": frm.doc.customer
                                },
                                doc: frm.doc
                            },
                            callback: function(r){
                                d.set_value("price", r.message.price_list_rate);
                            }
                        });
                    }
                }
            },
            {
                label: "Width",
                fieldname: "width",
                fieldtype: "Data",
                default: 0,
                change: ()=>{
                   let item = d.get_value("item_code");
                   d.set_value("sqm",flt(d.get_value("width"))*flt(d.get_value("height")));
                   if(d.get_value("sqm")){
                        d.set_value("free_items", get_components(item, d.get_value("sqm")));
                   }
                   d.set_value("cbm", flt(d.get_value("width"))*flt(d.get_value("height"))*flt(d.get_value("depth")));
                }
            },
            {
                label: "CBM",
                fieldtype: "Float",
                read_only: 1,
                fieldname: "cbm"
            },
            {
                fieldtype: "Column Break"
            },
            {
                label: "Material",
                fieldname: "material",
                fieldtype: "Link",
                options: "Material"
            },
            {
                label: "Height",
                fieldname: "height",
                fieldtype: "Data",
                change: ()=>{
                   let item = d.get_value("item_code");
                   d.set_value("sqm",flt(d.get_value("width"))*flt(d.get_value("height")));
                   if(d.get_value("sqm")){
                        d.set_value("free_items", get_components(item, d.get_value("sqm")));
                   }
                   d.set_value("cbm", flt(d.get_value("width"))*flt(d.get_value("height"))*flt(d.get_value("depth")));
                }
            },
            {
                fieldtype: "Float",
                fieldname: "sqm",
                label: "SQM",
                read_only: 1
            },
            {
                fieldtype: "Column Break"
            },
            {
                label: "Room",
                fieldtype: "Link",
                fieldname: "room",
                options: "Customer Room",
                get_query: function(){
                    return{
                        filters:[
                            ["Customer Room", "address", "=", frm.doc.customer_address]
                        ]
                    }
                }

            },
            {
                label: "Depth",
                fieldname: "depth",
                fieldtype: "Link",
                options: "Depth",
                change: ()=>{
                    d.set_value("cbm", flt(d.get_value("width"))*flt(d.get_value("height"))*flt(d.get_value("depth")));
                }
            },
            {
                label: "Price",
                fieldname: "price",
                fieldtype: "Float",
                hidden: 1
            },
            {
                fieldtype: "Section Break"
            },
            {
                fieldtype: "HTML",
                fieldname: "free_items",
            },
            {
            label: 'Components',
            fieldname: 'components',
            fieldtype: 'Table',
            data: comp_data,
            fields: [
                {
                    label: "Item Code",
                    fieldname: "item_code",
                    fieldtype: "Link",
                    options: "Item",
                    in_list_view: 1,
                    get_query: (doc)=>{
                        cur_dialog_idx = doc.idx -1;
                    },
                    change: ()=>{
                        var row = d.fields_dict.components.df.data[cur_dialog_idx];
                        var items = d.fields_dict.components;
                        frappe.call({
                            method: "erpnext.stock.get_item_details.get_item_details",
                            args:{
                                args:{
                                "item_code": row.item_code,
                                "company": frm.doc.company,
                                "doctype": "Sales Invoice",
                                "conversion_rate": 1.0,
                                "price_list": "Standard Selling",
                                "customer": frm.doc.customer
                                 },
                                 doc: frm.doc
                            },
                            callback: function(r){
                                items.df.data[cur_dialog_idx].price = r.message.price_list_rate;
                                frappe.db.get_value("Item", row.item_code, "is_wooden").then(res => {
                                    if (res.message.is_wooden){
                                        items.df.data[cur_dialog_idx].material = d.get_value("material");
                                        items.df.data[cur_dialog_idx].is_wooden = res.message.is_wooden;
                                    }
                                });
                                d.set_value("componetns", items);
                                items.grid.refresh();
                            }
                        });
                    }
                },
                {
                    label: "Qty",
                    fieldname: "qty",
                    fieldtype: "Data",
                    in_list_view: 1
                },
                {
                    label: "Price",
                    fieldname: "price",
                    fieldtype: "Data",
                    in_list_view: 1
                },
                {
                    label: "Is Wooden",
                    fieldname: "is_wooden",
                    fieldtype: "Check",
                    hidden: 1
                },
                {
                    fieldtype: "Link",
                    fieldname: "material",
                    label: "Material",
                    options: "Material"
                },
                {
                    fieldtype: "Small Text",
                    fieldname: "component_details",
                    label: "Component Details",
                }
            ],
            },
            {
                fieldtype: "Section Break",
                label: "Totals"
            },
            {
                fieldtype: "Currency",
                fieldname: "components_total",
                label: "Components Total",
                read_only: 1
            },
            {
                fieldtype: "Column Break"
            },
            {
                fieldtype: "Currency",
                label: "Item Price",
                fieldname: "item_price",
                read_only: 1
            },
            {
                fieldtype: "Column Break"
            },
            {
                fieldtype: "Currency",
                fieldname: "total_price",
                label: "Total Price",
                read_only: 1
            }
        ],
        primary_action : async function(values){
            var comp_str = "";
            if(values.components){
                values.components.forEach(comp => comp_str += comp.item_code + ": "+ comp.qty+ "\n");
            }
            let gross = (await frappe.db.get_value("Material", values.material, "gross_percent")).message.gross_percent;
            let row = null;
            if (cdt && cdn){
                row = locals[cdt][cdn]
            }
            else{
                row = frm.add_child("items",{})
            }
            row.material = values.material;
            row.room = values.room;
            row.item_code = values.item_code;
            row.height = values.height;
            row.depth = values.depth;
            row.width = values.width;
            row.sqm = values.sqm;
            for(var i=0; i<values.components.length; i++)
                delete values.components[i]["__checked"];
            row.component_json = JSON.stringify(values.components);
            row.components = comp_str;
            row.material_gross = gross;
            row.qty = values.cbm;
            var x = frm.trigger("item_code", row.doctype, row.name);
            Promise.all([x]).then(res => {
                frm.trigger("material_gross", row.doctype, row.name);
                d.hide();
            });
        },
        secondary_action_label: "Calculate Totals",
        secondary_action: async function(){
            //componets total
            var components = d.get_value("components");
            var components_total = 0;
            for(var i=0; i<components.length; i++){
                var line_grosss = 1;
                if(components[i].material && components[i].is_wooden){
                    line_grosss += (await frappe.db.get_value("Material", components[i].material, "gross_percent")).message.gross_percent;
                }
                if (components[i].qty && components[i].price)
                    components_total += parseFloat(components[i].qty) * parseFloat(components[i].price)* parseFloat(line_grosss); 
            }
            d.set_value("components_total", components_total);
            //item price
            var item_price = 0;
            if(d.get_value("cbm")){
                var material_gross = (await frappe.db.get_value("Material", d.get_value("material"), "gross_percent")).message.gross_percent;
                item_price =  parseFloat(d.get_value("price")) * (parseFloat(material_gross) + 1) * parseFloat(d.get_value("cbm"));
            }
            d.set_value("item_price", item_price);
            //total price
            d.set_value("total_price", components_total + item_price);
        }
    });
    //filling fields if there is data
    if (cdt != null && cdn != null) {
        var row = locals[cdt][cdn];
        var fields = ["material", "room", "item_code", "height", "depth", "width", "sqm"];
        fields.forEach(f => {
            d.set_value(f, row[f]);
        });
        d.set_value("cbm", row["qty"]);
        d.set_value("row", row["idx"]);
    }

    var components_grid = d.fields_dict.components.grid;
    //add edit button for doors, shelfs and drawers details
    var edit_btn = components_grid.add_custom_button("Edit", function(){
        var selected_items = components_grid.get_selected_children();
        frappe.db.get_value("Item", selected_items[0].item_code, ["has_color", "has_specialty", "has_handles", "has_additions", "has_sections", "has_dimensions"]).then(value => {
            var comp_obj = null;
            var sections_table = [];
            var additions_table = [];
            var dialog_fields = [];
            var cd = null;
            if(selected_items[0].component_details){
                comp_obj = JSON.parse(selected_items[0].component_details);
                sections_table = comp_obj.sections;
                additions_table = comp_obj.additions;
            }
            if(value.message.has_dimensions){
                dialog_fields = dialog_fields.concat([
                    {
                        fieldname: "width",
                        fieldtype: "Float",
                        label: "Width",
                    },
                    {
                        fieldname: "height",
                        fieldtype: "Float",
                        label: "Height",
                    }]);
            }
            if(value.message.has_sections){
                dialog_fields = dialog_fields.concat([
                    {
                        fieldname: "sections",
                        fieldtype: "Table",
                        label: "Sections",
                        data: sections_table,
                        fields: [
                            {
                                fieldname: "coverage_percentage",
                                fieldtype: "Percent",
                                label: "Coverage Percentage",
                                in_list_view: 1,
                                change: function(){
                                    var grid_rows = cd.fields_dict.sections.grid.grid_rows
                                    var total_area = parseFloat(cd.get_values().width) * parseFloat(cd.get_values().height);
                                    for(var i=0; i<grid_rows.length; i++){
                                        grid_rows[i].doc.area = total_area * parseFloat(grid_rows[i].doc.coverage_percentage) /100;
                                        grid_rows[i].refresh();
                                    }
                                    

                                }
                            },
                            {
                                fieldname: "material",
                                fieldtype: "Link",
                                label: "Material",
                                options: "Material",
                                in_list_view: 1
                            },
                            {
                                fieldname: "area",
                                label: "Area (SQM)",
                                fieldtype: "Read Only",
                                in_list_view: 1
                            }

                            ]
                    }
                ]);
            }
            if(value.message.has_color){
                dialog_fields = dialog_fields.concat([
                    {
                        fieldtype: "Section Break"
                    },
                    {
                        fieldname: "color",
                        fieldtype: "Link",
                        options: "Material",
                        label: "Color"
                    }
                ]);
            }
            if(value.message.has_specialty){
                dialog_fields = dialog_fields.concat([
                    {
                        fieldtype: "Section Break"
                    },
                    {
                        fieldname: "specialty",
                        fieldtype: "Link",
                        options: "Item",
                        label: "Specialty"
                    }
                ]);                
            }
            if(value.message.has_handles){
                dialog_fields = dialog_fields.concat([
                    {
                        fieldtype: "Section Break"
                    },
                    {
                        fieldname: "handles",
                        fieldtype: "Link",
                        options: "Item",
                        label: "Handles"
                    }
                ]);                
            }
            if(value.message.has_additions){
                dialog_fields = dialog_fields.concat([
                    {
                        fieldtype: "Section Break"
                    },
                    {
                        fieldname: "additions",
                        fieldtype: "Table",
                        label: "Additions",
                        data: additions_table,
                        fields: [
                            {
                                in_list_view: 1,
                                fieldname: "item",
                                fieldtype: "Link",
                                options: "Item",
                                label: "Item"
                            }
                        ]
                    }
                ]);
            }
            dialog_fields = dialog_fields.concat([
                {
                    fieldname: "base_total",
                    fieldtype: "Read Only",
                    label: "Base Total",
                },
                {
                    fieldname: "additionals_total",
                    fieldtype: "Read Only",
                    label: "Additionals Total",
                },
                {
                    fieldname: "total",
                    fieldtype: "Read Only",
                    label: "Total",
                },
                
                ])
            cd = new frappe.ui.Dialog({
                title: "Edit Component",
                fields: dialog_fields,
                primary_action_label: "Submit",
                primary_action: function(values){
                    frappe.call({
                        method: "unique_closets.unique_closets.sales_order_calculation.calculate_component_total",
                        args:{
                            sales_order: JSON.stringify(frm.doc),
                            item: selected_items[0].item_code,
                            args: JSON.stringify(values)
                        },
                        freeze: 1,
                        freeze_message: "Calculating Totals",
                    }).then(res =>{
                        values.base_total = parseFloat(res.message[0]);
                        values.additionals_total = parseFloat(res.message[1]);
                        values.total = parseFloat(res.message[0]) + parseFloat(res.message[1]);
                        d.fields_dict.components.grid.data[selected_items[0].idx - 1].component_details = JSON.stringify(values);
                        d.fields_dict.components.grid.data[selected_items[0].idx - 1].price = values.total;
                        d.fields_dict.components.grid.refresh();
                        cd.hide();
                        d.fields_dict.components.grid.wrapper.find('.grid-row-check').prop('checked', false);
                        edit_btn.hide();
                    });
                    
                },
                secondary_action_label: "Calc Totals",
                secondary_action: function(){
                    var values = cd.get_values();
                    frappe.call({
                        method: "unique_closets.unique_closets.sales_order_calculation.calculate_component_total",
                        args:{
                            sales_order: JSON.stringify(frm.doc),
                            item: selected_items[0].item_code,
                            args: JSON.stringify(values)
                        },
                        freeze: 1,
                        freeze_message: "Calculating Totals",
                    }).then(res => {
                        cd.set_value("base_total", res.message[0]);
                        cd.set_value("additionals_total", res.message[1]);
                        cd.set_value("total", parseFloat(res.message[0]) + parseFloat(res.message[1]));
                    });
                }
            });
            cd.show();
            if(comp_obj){
                for(const key in comp_obj){
                    if(!["additions", "sections"].includes(key)){
                        cd.set_value(key, comp_obj[key]);
                    }
                }
            }
        });
    });
    edit_btn.hide();
    d.fields_dict.components.$wrapper.on("click", ".grid-row-check", (e) => {
        if(d.fields_dict.components.grid.get_selected().length){
            edit_btn.show();
        }
        else{
            edit_btn.hide();
        }
    });
    d.show();
}