sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("cotemar.solicitudprontospagos.controller.App", {
            onInit: function () {
                var oViewConfig = {
                    layaout: "OneColumn",
                    showFooter: true,
                    minorPurchase: false,
                    filterBar: {
                        Sociedad: true,
                        Proveedor: true,
                        Solicitud: false,
                        Moneda: true,
                        Solicitante: false,
                        Estado: false,
                        Fecha: true,
                        Documento: true
                    }
                };
                this.getOwnerComponent().getModel("appView").setData(oViewConfig);
                // var oModelViewConfig = new JSONModel(oViewConfig);
                // this.getView().setModel(oModelViewConfig, "appView");
            }
        });
    });
