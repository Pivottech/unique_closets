// Copyright (c) 2021, PivotERP and contributors
// For license information, please see license.txt

frappe.ui.form.on('Model', {
	width: function (frm) { calculate_model(frm); },
	height: function (frm) { calculate_model(frm); },
	depth: function (frm) { calculate_model(frm); }
});

function calculate_model(frm) {
	if (parseFloat(frm.doc.width) && parseFloat(frm.doc.height)) {
		frm.set_value("area", parseFloat(frm.doc.width) * parseFloat(frm.doc.height));
	}
	if (parseFloat(frm.doc.width) && parseFloat(frm.doc.height) && parseFloat(frm.doc.depth)) {
		frm.set_value("volume", parseFloat(frm.doc.width) * parseFloat(frm.doc.height) * parseFloat(frm.doc.depth));
	}
}
