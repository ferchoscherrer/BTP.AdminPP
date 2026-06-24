// webapp/controller/AdminMaster.controller.js
sap.ui.define([
    "./BaseController",
    "../model/formatter"
], function (BaseController, formatter) {
    "use strict";
    return BaseController.extend("cotemar.adminprontospagos.controller.AdminMaster", {
        formatter: formatter,
        onInit: function () {
            this.loadAllApplications();
        },
        loadAllApplications: function () {
            // Llamada al endpoint que creamos en el backend
            $.ajax({
                url: "/api/applications/admin/all", // Asegúrate que esta ruta coincida con tu approuter
                method: "GET",
                success: function (oData) {
                    var oModel = new sap.ui.model.json.JSONModel(oData);
                    this.getView().setModel(oModel);
                }.bind(this)
            });
        }
    });
});