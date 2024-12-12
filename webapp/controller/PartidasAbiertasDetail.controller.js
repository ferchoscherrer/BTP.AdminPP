
sap.ui.define([
    "cotemar/solicitudprontospagos/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Controller, JSONModel, History, formatter, MessageBox) {
        "use strict";

        return BaseController.extend("cotemar.solicitudprontospagos.controller.PartidasAbiertasDetail", {
            formatter: formatter,
            onInit: function () {
                /* this.getOwnerComponent().getRouter()
                    .getRoute("PartidasAbiertasDetail")
                    .attachPatternMatched(this.onRouteMatchpartidaAbiertaDetail, this); */
            },
            // onRouteMatchpartidaAbiertaDetail: function (oEvent) {
            //     let oFilter = [];
            //     let zbuzei = oEvent.getParameter("arguments").zbuzei,
            //         zbelnr = oEvent.getParameter("arguments").zbelnr,
            //         zbukrs = oEvent.getParameter("arguments").zbukrs,
            //         zspras = oEvent.getParameter("arguments").zspras,
            //         zgjahr = oEvent.getParameter("arguments").zgjahr,
            //         zmandt = oEvent.getParameter("arguments").zmandt
            //     let sPath = `(Zmandt='${zmandt}',Zgjahr='${zgjahr}',Zspras='${zspras}',Zbukrs='${zbukrs}',Zbelnr='${zbelnr}',Zbuzei='${zbuzei}')`
            //     oFilter.push(new sap.ui.model.Filter("Zbuzei", sap.ui.model.FilterOperator.EQ, zbuzei))
            //     oFilter.push(new sap.ui.model.Filter("Zbelnr", sap.ui.model.FilterOperator.EQ, zbelnr))
            //     oFilter.push(new sap.ui.model.Filter("Zbukrs", sap.ui.model.FilterOperator.EQ, zbukrs))
            //     oFilter.push(new sap.ui.model.Filter("Zspras", sap.ui.model.FilterOperator.EQ, zspras))
            //     oFilter.push(new sap.ui.model.Filter("Zgjahr", sap.ui.model.FilterOperator.EQ, zgjahr))
            //     oFilter.push(new sap.ui.model.Filter("Zmandt", sap.ui.model.FilterOperator.EQ, zmandt))
            //     this.getOwnerComponent().getModel("prontoPago").read("/ReadDocSet", {
            //         filters: oFilter,
            //         success: function (response) {
            //             console.log(response);
            //             this.getOwnerComponent().getModel("partidaAbiertaDetail").setData(response.results)
            //         }.bind(this),
            //         error: function (error) {
            //             console.log(error);
            //         }.bind(this),
            //     });
            // },
            onClosePartidasAbiertasDetailPress: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getOwnerComponent().getRouter().navTo("SolicitudMaster", {}, true);
                }
                this.getView()
                    .getModel("appView")
                    .setProperty("/layout", "OneColumn");
                this.getOwnerComponent().getRouter().navTo("SolicitudMaster");
            },
            /*             onAddNewDocument: function () {
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
                        }, */
            onCloseDialogNewDocument: function () {
                this.getView().byId("CreateNewDocumentDialog").close()
            },
            onPressApprove: function () {

                this.byId("PartidasAbiertasLayoutId").setBusy(true)
                let oDataToSend = {}
                let oModelDatosPartidaAbierta = this.getView().getModel("partidaAbiertaDetail").getData();

                oDataToSend.paymentDate = this.getView().byId("DPPartidasAbiertas").getDateValue();
                oDataToSend.reason = this.getView().byId("IObservacionesPartidasAbiertas").getValue();
                //Validamos que la fecha exista
                if (!oDataToSend.paymentDate) {
                    MessageBox.warning("Ingrese una fecha válida para la solicitud");
                    this.byId("PartidasAbiertasLayoutId").setBusy(false)
                    return
                }
                //Validamos que la fecha ingresada corresponda a la semana siguiente a la actual y sea jueves o viernes
                else if (this.validateDayAndWeek(oDataToSend.paymentDate) === false) {
                    this.byId("PartidasAbiertasLayoutId").setBusy(false)
                    return
                }

                if (!oDataToSend.reason) {
                    MessageBox.warning("Ingrese una justificación para la solicitud");
                    this.byId("PartidasAbiertasLayoutId").setBusy(false)
                    return
                }

                oDataToSend.aniocontable = oModelDatosPartidaAbierta.Zgjahr;
                oDataToSend.apuntecontable = oModelDatosPartidaAbierta.Zbuzei;
                oDataToSend.areasolicitante = this.getView().getModel("userData").getData().area;
                oDataToSend.ceco = oModelDatosPartidaAbierta.Zkostl;
                oDataToSend.document = oModelDatosPartidaAbierta.Zbelnr;
                oDataToSend.fechapartida = oModelDatosPartidaAbierta.Zfecha;
                oDataToSend.fechavencimiento = oModelDatosPartidaAbierta.Zvenc;
                oDataToSend.folio = oModelDatosPartidaAbierta.Zfolio;
                oDataToSend.idioma = oModelDatosPartidaAbierta.Zspras;
                oDataToSend.mandante = oModelDatosPartidaAbierta.Zmandt;
                oDataToSend.moneda = oModelDatosPartidaAbierta.Zwaers;
                oDataToSend.monedadesc = oModelDatosPartidaAbierta.ZwaersDesc;
                oDataToSend.money = oModelDatosPartidaAbierta.Zwrbtr; //formatter.formatNumber(oModelDatosPartidaAbierta.Zwrbtr)
                oDataToSend.ordencompra = oModelDatosPartidaAbierta.Zoc;
                oDataToSend.referencia = oModelDatosPartidaAbierta.Zref;
                oDataToSend.society = oModelDatosPartidaAbierta.Zbukrs;
                oDataToSend.sociedaddesc = oModelDatosPartidaAbierta.ZbukrsDesc;
                oDataToSend.supplier = oModelDatosPartidaAbierta.Zlifnr;
                oDataToSend.supplierdesc = oModelDatosPartidaAbierta.ZlifnrDesc;

                // AGREGAR ESTO SI ES REENVIADA
                if (oModelDatosPartidaAbierta.suffix && oModelDatosPartidaAbierta.requestId) {
                    oDataToSend.suffix = oModelDatosPartidaAbierta.suffix;
                    oDataToSend.requestId = oModelDatosPartidaAbierta.requestId;
                }

                let sUrl = this.getBaseURL() + "/api/applications/"
                let settings = {
                    url: sUrl,
                    method: "POST",
                    timeout: 0,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(oDataToSend),
                };

                $.ajax(settings).done(function (response) {
                    this.byId("PartidasAbiertasLayoutId").setBusy(false)
                    this.getView().getModel("solicitudes").refresh()
                    MessageBox.success("Solicitud enviada para su aprobación correctamente", {
                        title: "Enviada exitosamente",
                    })
                    this.onClosePartidasAbiertasDetailPress()
                }.bind(this)).fail(function (error) {
                    this.byId("PartidasAbiertasLayoutId").setBusy(false)
                    if (error.responseJSON) {
                        MessageBox.error(error.responseJSON.error)
                    } else {
                        MessageBox.error("Ha surgido un error en la carga de datos")
                    }
                }.bind(this))
            },

            validateDayAndWeek: function(selectedDay) {
                let currentDate = new Date();
                
                // console.log(">>> Mes fecha hoy: " + currentDate.getMonth());
                // console.log(">>> Mes fecha seleccionada: " + selectedDay.getMonth());
                
                let weekOfCurrentDay = this.obtenerNumeroSemanaMes(currentDate);
                let weekOfSelectedDay = this.obtenerNumeroSemanaMes(selectedDay);
                
                // console.log(">>> weekOfCurrentDay: " + weekOfCurrentDay);
                // console.log(">>> weekOfSelectedDay: " + weekOfSelectedDay);
                
                const isNextMonth = currentDate.getMonth() < selectedDay.getMonth();
                // console.log(">>> Is Next Month: " + isNextMonth);
                
                const isWeekNext = weekOfCurrentDay < weekOfSelectedDay;
                // console.log(">>> Is Week next: " + isWeekNext);
                
                const isWednesdayOrThursday = selectedDay.getDay() === 4 || selectedDay.getDay() === 3;
                
                if ((isNextMonth || isWeekNext) && isWednesdayOrThursday) {
                  return true
                }
                
                MessageBox.error("La fecha de solicitud tiene que ser miercoles o jueves a partir de la siguiente semana", {
                  title: "Error de Fecha",
                })

                return false
            }
            ,
            obtenerNumeroSemanaMes: function (fecha) {
                var primerDiaMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
                var diaPrimerDiaMes = primerDiaMes.getDay();
                var diasAnteriores = (diaPrimerDiaMes === 0) ? 6 : (diaPrimerDiaMes - 1);
                var primerDiaSemana = new Date(fecha.getFullYear(), fecha.getMonth(), 1 - diasAnteriores);
                var milisegundosDiferencia = fecha.getTime() - primerDiaSemana.getTime();
                var numeroSemanaMes = Math.ceil((milisegundosDiferencia / (1000 * 60 * 60 * 24) + 1) / 7);
                return numeroSemanaMes;
            }
        });
    });
