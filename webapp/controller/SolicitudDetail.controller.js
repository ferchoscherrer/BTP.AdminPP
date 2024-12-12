sap.ui.define(
    [
        "cotemar/solicitudprontospagos/controller/BaseController",
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/routing/History",
        "../model/formatter",
        "sap/m/MessageBox",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        BaseController,
        Controller,
        JSONModel,
        History,
        formatter,
        MessageBox
    ) {
        "use strict";

        return BaseController.extend(
            "cotemar.solicitudprontospagos.controller.SolicitudDetail",
            {
                formatter: formatter,
                onInit: function () {
                    this.getOwnerComponent()
                        .getRouter()
                        .getRoute("SolicitudDetail")
                        .attachPatternMatched(this.onRouteMatchSolicitudDetail, this);
                },
                onRouteMatchSolicitudDetail: function (oEvent) {
                    /*   var idSolicitud = oEvent.getParameter("arguments").idSolicitud
                            this.getView().bindElement({
                                path: "/" + idSolicitud,
                                model: "solicitudes",
                                parameters: {
                                    expand: "es"
                                },
                                events: {
                                    dataReceived: function (params) {
                                        debugger;
                                        var oSolicitud = params.getParameter("data")
                                        this.getApprovers(oSolicitud.ID_WORKFLOW)
                                    }.bind(this)
                                }
            
                            }); */
                    this.byId("ObjectPageLayoutid").setBusy(true);
                    let oModel = this.getOwnerComponent().getModel("solicitudes");
                    let oArgs = oEvent.getParameter("arguments");
                    let sPath ="/solicitud(ID_SOLICITUD=" + oArgs.idSolicitud + ",SOLICITUD_VERSION=" + oArgs.idSolicitudVersion +")";
                    oModel.read(sPath, {
                        urlParameters: {
                            $expand: "es",
                        },
                        success: function (response) {
                            this.byId("ObjectPageLayoutid").setBusy(false);
                            this.getOwnerComponent()
                                .getModel("solicitudDetail")
                                .setData(response);
                            this.getApprovers(response.ID_WORKFLOW);
                        }.bind(this),
                        error: function (error) {
                            this.byId("ObjectPageLayoutid").setBusy(false);
                        }.bind(this),
                    });
                },
                getApprovers: function (idWorkflow) {
                    this.byId("processflow").setBusy(true);
                    let sUrl = this.getBaseURL() + "/api/applications/" + idWorkflow;
                    let settings = {
                        url: sUrl,
                        method: "GET",
                        timeout: 0,
                    };
                    $.ajax(settings)
                        .done(
                            function (response) {
                                let processFlow = this.byId("processflow");
                                this.prepareNodes(response.wf.context.approvers);
                                this.prepareLanes(response.wf.context.approvers);
                                processFlow.updateModel();
                                processFlow.setBusy(false);
                            }.bind(this)
                        )
                        .fail(
                            function (error) {
                                this.byId("processflow").setBusy(false);
                                MessageBox.error(
                                    "Ha ocurrido un error al obtener los aprobadores."
                                );
                            }.bind(this)
                        );
                },
                prepareNodes: function (approvers) {
                    let nodes = [];
                    let node1Template = {
                        id: "1",
                        lane: "0",
                        title: "Nivel 1",
                        titleAbbreviation: "",
                        children: [2],
                        state: "",
                        stateText: "",
                        focused: true,
                        texts: null,
                    };
                    let node2Template = {
                        id: "2",
                        lane: "1",
                        title: "Nivel 2",
                        titleAbbreviation: "",
                        children: [3],
                        state: "",
                        stateText: "",
                        focused: false,
                        texts: null,
                    };
                    let node3Template = {
                        id: "3",
                        lane: "2",
                        title: "Nivel 3",
                        titleAbbreviation: "",
                        children: [4],
                        state: "",
                        stateText: "",
                        focused: false,
                        texts: null,
                    };
                    let node4Template = {
                        id: "4",
                        lane: "3",
                        title: "Nivel 4",
                        titleAbbreviation: "",
                        children: [],
                        state: "",
                        stateText: "",
                        focused: false,
                        texts: null,
                    };
                    if (approvers.nivel1) {
                        if (approvers.nivel1) {
                            if (approvers.nivel1.pendingApprovers) {
                                node1Template.titleAbbreviation = "Pendiente";
                                node1Template.state = "Critical";
                                node1Template.stateText = formatter.formatEmailApprover(
                                    approvers.nivel1.pendingApprovers
                                );
                            } else {
                                if (approvers.nivel1.accion === "A") {
                                    node1Template.titleAbbreviation = "Aprobado";
                                    node1Template.state = "Positive";
                                }
                                if (approvers.nivel1.accion === "C") {
                                    node1Template.titleAbbreviation = "Cancelado";
                                    node1Template.state = "Neutral";
                                }
                                if (approvers.nivel1.accion === "R") {
                                    node1Template.titleAbbreviation = "Rechazado";
                                    node1Template.state = "Negative";
                                }
                                node1Template.stateText = approvers.nivel1.mailResponsable;
                                if (approvers.nivel1.observaciones) {
                                    node1Template.texts = [approvers.nivel1.observaciones];
                                } else {
                                    node1Template.texts = [""];
                                }
                            }
                            nodes.push(node1Template);
                        }
                    }
                    if (approvers.nivel2) {
                        if (approvers.nivel2) {
                            if (approvers.nivel2.pendingApprovers) {
                                node2Template.titleAbbreviation = "Pendiente";
                                node2Template.state = "Critical";
                                node2Template.stateText = formatter.formatEmailApprover(
                                    approvers.nivel2.pendingApprovers
                                );
                            } else {
                                if (approvers.nivel2.accion === "A") {
                                    node2Template.titleAbbreviation = "Aprobado";
                                    node2Template.state = "Positive";
                                }
                                if (approvers.nivel2.accion === "C") {
                                    node2Template.titleAbbreviation = "Cancelado";
                                    node2Template.state = "Neutral";
                                }
                                if (approvers.nivel2.accion === "R") {
                                    node2Template.titleAbbreviation = "Rechazado";
                                    node2Template.state = "Negative";
                                }
                                node2Template.stateText = approvers.nivel2.mailResponsable;
                                if (approvers.nivel2.observaciones) {
                                    node2Template.texts = [approvers.nivel2.observaciones];
                                } else {
                                    node2Template.texts = [""];
                                }
                            }
                            nodes.push(node2Template);
                        }
                    }
                    if (approvers.nivel3) {
                        if (approvers.nivel3) {
                            if (approvers.nivel3.pendingApprovers) {
                                node3Template.titleAbbreviation = "Pendiente";
                                node3Template.state = "Critical";
                                node3Template.stateText = formatter.formatEmailApprover(
                                    approvers.nivel3.pendingApprovers
                                );
                            } else {
                                if (approvers.nivel3.accion === "A") {
                                    node3Template.titleAbbreviation = "Aprobado";
                                    node3Template.state = "Positive";
                                }
                                if (approvers.nivel3.accion === "C") {
                                    node3Template.titleAbbreviation = "Cancelado";
                                    node3Template.state = "Neutral";
                                }
                                if (approvers.nivel3.accion === "R") {
                                    node3Template.titleAbbreviation = "Rechazado";
                                    node3Template.state = "Negative";
                                }
                                node3Template.stateText = approvers.nivel3.mailResponsable;
                                if (approvers.nivel3.observaciones) {
                                    node3Template.texts = [approvers.nivel3.observaciones];
                                } else {
                                    node3Template.texts = [""];
                                }
                            }
                        }
                        nodes.push(node3Template);
                    }
                    if (approvers.nivel4) {
                        if (approvers.nivel4) {
                            if (approvers.nivel4.pendingApprovers) {
                                node4Template.titleAbbreviation = "Pendiente";
                                node4Template.state = "Critical";
                                node4Template.stateText = formatter.formatEmailApprover(
                                    approvers.nivel4.pendingApprovers
                                );
                            } else {
                                if (approvers.nivel4.accion === "A") {
                                    node4Template.titleAbbreviation = "Aprobado";
                                    node4Template.state = "Positive";
                                }
                                if (approvers.nivel4.accion === "C") {
                                    node4Template.titleAbbreviation = "Cancelado";
                                    node4Template.state = "Neutral";
                                }
                                if (approvers.nivel4.accion === "R") {
                                    node4Template.titleAbbreviation = "Rechazado";
                                    node4Template.state = "Negative";
                                }
                                node4Template.stateText = approvers.nivel4.mailResponsable;
                                if (approvers.nivel4.observaciones) {
                                    node4Template.texts = [approvers.nivel4.observaciones];
                                } else {
                                    node4Template.texts = [""];
                                }
                            }
                        }
                        nodes.push(node4Template);
                    }
                    this.getOwnerComponent()
                        .getModel("approversGraph")
                        .setProperty("/nodes", nodes);
                },
                prepareLanes: function (approvers) {
                    let lanes = [];
                    let lane1Template = {
                        id: "0",
                        icon: "sap-icon://order-status",
                        label: "",
                        position: 0,
                    };
                    let lane2Template = {
                        id: "1",
                        icon: "sap-icon://order-status",
                        label: "",
                        position: 1,
                    };
                    let lane3Template = {
                        id: "2",
                        icon: "sap-icon://order-status",
                        label: "",
                        position: 2,
                    };
                    let lane4Template = {
                        id: "3",
                        icon: "sap-icon://order-status",
                        label: "",
                        position: 3,
                    };
                    if (approvers.nivel1) {
                        if (approvers.nivel1.pendingApprovers) {
                            lane1Template.label = "Pendiente";
                        } else {
                            if (approvers.nivel1.accion === "A") {
                                lane1Template.label = "Aprobado";
                            }
                            if (approvers.nivel1.accion === "C") {
                                lane1Template.label = "Cancelado";
                            }
                            if (approvers.nivel1.accion === "R") {
                                lane1Template.label = "Rechazado";
                            }
                        }
                        lanes.push(lane1Template);
                    }
                    if (approvers.nivel2) {
                        if (approvers.nivel2.pendingApprovers) {
                            lane2Template.label = "Pendiente";
                        } else {
                            if (approvers.nivel2.accion === "A") {
                                lane2Template.label = "Aprobado";
                            }
                            if (approvers.nivel2.accion === "C") {
                                lane2Template.label = "Cancelado";
                            }
                            if (approvers.nivel2.accion === "R") {
                                lane2Template.label = "Rechazado";
                            }
                        }
                        lanes.push(lane2Template);
                    }
                    if (approvers.nivel3) {
                        if (approvers.nivel3.pendingApprovers) {
                            lane3Template.label = "Pendiente";
                        } else {
                            if (approvers.nivel3.accion === "A") {
                                lane3Template.label = "Aprobado";
                            }
                            if (approvers.nivel3.accion === "C") {
                                lane3Template.label = "Cancelado";
                            }
                            if (approvers.nivel3.accion === "R") {
                                lane3Template.label = "Rechazado";
                            }
                        }
                        lanes.push(lane3Template);
                    }
                    if (approvers.nivel4) {
                        if (approvers.nivel4.pendingApprovers) {
                            lane4Template.label = "Pendiente";
                        } else {
                            if (approvers.nivel4.accion === "A") {
                                lane4Template.label = "Aprobado";
                            }
                            if (approvers.nivel4.accion === "C") {
                                lane4Template.label = "Cancelado";
                            }
                            if (approvers.nivel4.accion === "R") {
                                lane4Template.label = "Rechazado";
                            }
                        }
                        lanes.push(lane4Template);
                    }

                    this.getOwnerComponent()
                        .getModel("approversGraph")
                        .setProperty("/lanes", lanes);
                },
                onCloseSolicitudDetailPress: function () {
                    var oHistory = History.getInstance();
                    var sPreviousHash = oHistory.getPreviousHash();
                    if (sPreviousHash !== undefined) {
                        window.history.go(-1);
                    } else {
                        this.getOwnerComponent()
                            .getRouter()
                            .navTo("SolicitudMaster", {}, true);
                    }
                    this.getView().getModel("appView").setProperty("/layout", "OneColumn");
                    this.getOwnerComponent().getRouter().navTo("SolicitudMaster");
                },
                onAddNewDocument: function () {
                    var oView = this.getView();
                    let oDialog = this.getView().byId("CreateNewDocumentDialog");
                    if (!oDialog) {
                        sap.ui.core.Fragment.load({
                            id: oView.getId(),
                            name: "cotemar.solicitudprontospagos.view.fragments.newDocument",
                            controller: this,
                        }).then(function (oDialog) {
                            oView.addDependent(oDialog);
                            oDialog.open();
                        });
                    } else {
                        oDialog.open();
                    }
                },
                onCloseDialogNewDocument: function () {
                    this.getView().byId("CreateNewDocumentDialog").close();
                },

                onZoomInProcessFlow: function () {
                    this.getView().byId("processflow").zoomIn();
                },

                onZoomOutProcessFlow: function () {
                    this.getView().byId("processflow").zoomOut();
                },

                onNodePress: function (oEvent) {
                    
                    let oNode = oEvent.getParameters();
                    let sStateText = oNode.getStateText();
                    let aApprovers = sStateText.split("-");
                    let sState = oNode.getState();
                    let sTitle = oNode.getTitleAbbreviation();

                    let sMessageBoxType;
                    switch (sState) {
                        case "Critical":
                            sMessageBoxType = sap.m.MessageBox.Icon.WARNING;
                            break;
                        case "Positive":
                            sMessageBoxType = sap.m.MessageBox.Icon.SUCCESS;
                            break;
                        case "Negative":
                            sMessageBoxType = sap.m.MessageBox.Icon.ERROR;
                            break;
                        default:
                            sMessageBoxType = sap.m.MessageBox.Icon.INFORMATION;
                    }

                    let sMessageBody =
                        "Lista de aprobadores:\n" + aApprovers.filter((approver) => approver.trim() !== "").map((approver) => "• " + approver).join("\n");

                    sap.m.MessageBox.show(sMessageBody, {
                        icon: sMessageBoxType,
                        title: `Estado: ${sTitle}`,
                        actions: [sap.m.MessageBox.Action.CLOSE],
                    });
                },

                onPressReenviarSolicitud: function () {
                    let oPartidaAbierta = this.getView().getModel("solicitudDetail").getData();

                    let oProperties = {
                        Zbuzei: oPartidaAbierta.APUNTE_CONTABLE,
                        Zbelnr: oPartidaAbierta.DOCUMENT,
                        Zbukrs: oPartidaAbierta.SOCIETY,
                        ZbukrsDesc: oPartidaAbierta.SOCIEDAD_DESC,
                        Zlifnr: oPartidaAbierta.SUPPLIER,
                        ZlifnrDesc: oPartidaAbierta.SUPPLIER_DESC,
                        Zspras: oPartidaAbierta.IDIOMA,
                        Zgjahr: oPartidaAbierta.ANIO_CONTABLE,
                        Zwaers: oPartidaAbierta.MONEDA,
                        ZwaersDesc: oPartidaAbierta.MONEDA_DESC,
                        Zwrbtr: oPartidaAbierta.MONEY,
                        Zdmbtr: oPartidaAbierta.Zdmbtr,
                        Zfecha: oPartidaAbierta.FECHA,
                        Zoc: oPartidaAbierta.ORDEN_COMPRA,
                        Zvenc: oPartidaAbierta.FECHA_VENCIMIENTO,
                        Zmandt: oPartidaAbierta.MANDANTE,
                        Zkostl: oPartidaAbierta.CENTRO_COSTO,
                        Zref: oPartidaAbierta.REFERENCIA,
                        suffix: oPartidaAbierta.SOLICITUD_VERSION,
                        requestId: oPartidaAbierta.ID_SOLICITUD,
                        
                    };

                    this.getView().getModel("partidaAbiertaDetail").setData(oProperties);
                    this.getOwnerComponent().getRouter().navTo("PartidasAbiertasDetail", oProperties);
                    this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                },
            }
        );
    }
);
