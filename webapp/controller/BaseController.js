sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/ui/core/routing/History", "sap/ui/core/UIComponent"
], function (Controller, JSONModel, History, UIComponent) {
    "use strict";

    return Controller.extend("cotemar.solicitudprontospagos.controller.BaseController", {
        getBaseURL: function () {
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = sap.ui.require.toUrl(appPath);
            return appModulePath;
        }
    });
});
