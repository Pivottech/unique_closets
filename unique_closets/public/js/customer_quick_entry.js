frappe.provide('frappe.ui.form');

frappe.ui.form.CustomerQuickEntryForm = frappe.ui.form.QuickEntryForm.extend({
	init: function(doctype, after_insert, init_callback, doc, force) {
		after_insert = function(doc){
			console.log(this.dialog.get_values());
		}
		this._super(doctype, after_insert, init_callback, doc, force);
		this.skip_redirect_on_error = true;
	},
	insert: function(){
		delete this.dialog.doc.rooms;
		this._super();
	},
	update_doc: function(){},

	render_dialog: function() {
		this.mandatory = this.mandatory.concat(this.get_variant_fields());
		this._super();
	},

	get_variant_fields: function() {
		var variant_fields = [{
			fieldtype: "Section Break",
			label: __("Primary Contact Details"),
			collapsible: 1
		},
		{
			label: __("Email Id"),
			fieldname: "email_id",
			fieldtype: "Data"
		},
		{
			fieldtype: "Column Break"
		},
		{
			label: __("Mobile Number"),
			fieldname: "mobile_no",
			fieldtype: "Data"
		},
		{
			fieldtype: "Section Break",
			label: __("Primary Address Details"),
			collapsible: 1
		},
		{
			label: __("Address Line 1"),
			fieldname: "address_line1",
			fieldtype: "Data"
		},
		{
			label: __("Address Line 2"),
			fieldname: "address_line2",
			fieldtype: "Data"
		},
		{
			label: __("ZIP Code"),
			fieldname: "pincode",
			fieldtype: "Data"
		},
		{
			fieldtype: "Column Break"
		},
		{
			label: __("City"),
			fieldname: "city",
			fieldtype: "Data"
		},
		{
			label: __("State"),
			fieldname: "state",
			fieldtype: "Data"
		},
		{
			label: __("Country"),
			fieldname: "country",
			fieldtype: "Link",
			options: "Country"
		},
		{
			label: __("Customer POS Id"),
			fieldname: "customer_pos_id",
			fieldtype: "Data",
			hidden: 1
		},
		{
			label: "Rooms",
			fieldtype: "Table",
			fieldname: "rooms",
			options: "Customer Room",
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
	];

		return variant_fields;
	},
})
