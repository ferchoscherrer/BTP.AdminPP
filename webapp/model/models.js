sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device, Filter, FilterOperator) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            getComboInformation: function (oModelProntoPago, oModelCombo, sParameter) {

                var aFilters = [];
                // var oModelCombo = this.getOwnerComponent().getModel(sModelCombo);

                aFilters.push(new Filter("Campo", FilterOperator.EQ, sParameter));

                oModelProntoPago.read("/MatchcodesSet", {
                    filters: aFilters,
                    success: function (aReturnData) {
                        oModelCombo.setData(aReturnData.results)
                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                    }.bind(this)
                });
            }
        };
    });