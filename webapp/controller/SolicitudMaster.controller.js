sap.ui.define(
  [
    "cotemar/solicitudprontospagos/controller/BaseController",
    "cotemar/solicitudprontospagos/model/models",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    models,
    Controller,
    JSONModel,
    formatter,
    library,
    Spreadsheet,
    MessageBox,
    Filter,
    FilterOperator
  ) {
    "use strict";
    var EdmType = library.EdmType;
    return BaseController.extend(
      "cotemar.solicitudprontospagos.controller.SolicitudMaster",
      {
        formatter: formatter,
        onInit: function () {
          this.getOwnerComponent()
            .getRouter()
            .navTo("SolicitudMaster", {}, true);
          this.getUserData()
        },
        getUserData: function () {
          let sUrl = this.getBaseURL() + "/user-api/attributes"
          let settings = {
            url: sUrl,
            method: "GET",
            timeout: 0,
          };
          $.ajax(settings).done(function (response) {
            this.getOwnerComponent().getModel("userData").setData(response);
            this.loadSolicitudes()
            this.getOwnerComponent().getModel("userData").setProperty("/area", response.PostalCode[0])
           // this.getUserArea(response.email)
          }.bind(this)).fail(function (error) {
            MessageBox.error("Ha ocurrido un error al obtener los datos del usuario")
          }.bind(this))
        },
        getUserArea: function (email) {
          let sUrl = this.getBaseURL() + `/service/scim/Users?filter=emails eq "${email}"`
          let settings = {
            url: sUrl,
            method: "GET",
            timeout: 0,
          };
          $.ajax(settings).done(function (response) {
           
          }.bind(this)).fail(function (error) {
            MessageBox.error("Ha ocurrido un error al obtener el área del usuario.")
          }.bind(this))
        },
        loadSolicitudes: function () {
          let oTable = this.byId("SolicitudesListTable");
          let userEmail = this.getOwnerComponent().getModel("userData").getData().email
          let aFilter = [new Filter("USUARIO", FilterOperator.EQ, userEmail)]
          let oSort = new sap.ui.model.Sorter("ID_SOLICITUD", true)
          oTable.bindItems({
            path: "solicitudes>/solicitud",
            template: this.byId("SolicitudesTableItemTemplate"),
            templateShareable: true,
            filters: aFilter,
            sorter: oSort,
            parameters: {
              expand: "es"
            }
          })
        },

        onPressTabSelecion: function (oEvent) {
          var oAppView = this.getView().getModel("appView");
          var sSelectedKey = oEvent.getSource().getSelectedKey();
          switch (sSelectedKey) {
            case "tabFilerPartidasAbiertas":
              oAppView.setProperty("/filterBar/Solicitante", false);
              oAppView.setProperty("/filterBar/Estado", false);
              oAppView.setProperty("/filterBar/Solicitud", false);
              oAppView.setProperty("/filterBar/Fecha", true);
              oAppView.setProperty("/filterBar/Documento", true);
              break;
            case "tabFilerSolicitudes":
              oAppView.setProperty("/filterBar/Solicitante", true);
              oAppView.setProperty("/filterBar/Estado", true);
              oAppView.setProperty("/filterBar/Solicitud", true);
              oAppView.setProperty("/filterBar/Fecha", false);
              oAppView.setProperty("/filterBar/Documento", false);
              break;
            default:
              break;
          }
        },
        onPressPartidaAbierta: function (oEvent) {
      
          let oPartidaAbierta = oEvent.getSource().getBindingContext("prontoPago").getObject();
          let oProperties = {
            Zbuzei: oPartidaAbierta.Zbuzei,
            Zbelnr: oPartidaAbierta.Zbelnr,
            Zbukrs: oPartidaAbierta.Zbukrs,
            ZbukrsDesc: oPartidaAbierta.ZbukrsDesc,
            Zlifnr: oPartidaAbierta.Zlifnr,
            ZlifnrDesc: oPartidaAbierta.ZlifnrDesc,
            Zspras: oPartidaAbierta.Zspras,
            Zgjahr: oPartidaAbierta.Zgjahr,
            Zwaers: oPartidaAbierta.Zwaers,
            ZwaersDesc: oPartidaAbierta.ZwaersDesc,
            Zwrbtr: oPartidaAbierta.Zwrbtr,
            Zdmbtr: oPartidaAbierta.Zdmbtr,
            Zfecha: oPartidaAbierta.Zfecha,
            Zoc: oPartidaAbierta.Zoc,
            Zppago: oPartidaAbierta.Zppago,
            Zvenc: oPartidaAbierta.Zvenc,
            Zmandt: oPartidaAbierta.Zmandt,
          };
          this.getOwnerComponent().getRouter().navTo("PartidasAbiertasDetail", oProperties);
          this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
          this.getView().getModel("partidaAbiertaDetail").setData(oPartidaAbierta);
        },
        onPressSolicitud: function (oEvent) {
          /* let oSolicitud = oEvent.getSource().getBindingContext("solicitudes").getObject()
          this.getOwnerComponent().getRouter().navTo("SolicitudDetail", { idSolicitud: oSolicitud.ID_SOLICITUD, idEstado: oSolicitud.ID_ESTADO }); */
          let oSolicitud = oEvent.getSource().getBindingContext("solicitudes").getObject()
          this.getOwnerComponent().getRouter().navTo("SolicitudDetail", {
            idSolicitud: oSolicitud.ID_SOLICITUD,
            idSolicitudVersion: oSolicitud.SOLICITUD_VERSION,
          });
          this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
        },
        onPressNewRequest: function () {
          var oView = this.getView();
          let oDialog = this.getView().byId("CreateNewRequestDialog");
          if (!oDialog) {
            sap.ui.core.Fragment.load({
              id: oView.getId(),
              name: "cotemar.solicitudprontospagos.view.fragments.newRequest",
              controller: this,
            }).then(function (oDialog) {
              oView.addDependent(oDialog);
              oDialog.open();
            });
          } else {
            oDialog.open();
          }
        },
        onCloseDialogNewRequest: function () {
          this.getView().byId("CreateNewRequestDialog").close();
        },
        onExportExcel: function () {
          var aCols, oRowBinding, oSettings, oSheet, oTable;

          oTable = this.byId("SolicitudesListTable");
          oRowBinding = oTable.getBinding("items");
          aCols = this.createColumnConfig();

          oSettings = {
            workbook: {
              columns: aCols,
              hierarchyLevel: "Level",
            },
            dataSource: oRowBinding,
            fileName: "Solicitudes.xlsx",
            worker: false,
          };

          oSheet = new Spreadsheet(oSettings);
          oSheet.build().finally(function () {
            oSheet.destroy();
          });
        },
        createColumnConfig: function () {
          var aCols = [];

          aCols.push({
            label: "Cod. Sociedad",
            property: "SOCIETY",
            type: EdmType.String,
          });
          aCols.push({
            label: "Sociedad",
            property: "SOCIEDAD_DESC",
            type: EdmType.String,
          });
          aCols.push({
            label: "Cod. Proveedor",
            property: "SUPPLIER",
            type: EdmType.String,
          });
          aCols.push({
            label: "Proveedor",
            property: "SUPPLIER_DESC",
            type: EdmType.String,
          });
          aCols.push({
            label: "Documento",
            property: "DOCUMENT",
            type: EdmType.String,
          });
          aCols.push({
            label: "Ref. de Factura",
            property: "REFERENCIA",
            type: EdmType.String,
          });
          aCols.push({
            label: "Importe Factura",
            property: "MONEY",
            type: EdmType.Number,
            scale: 2,
            delimiter: true,
          });
          aCols.push({
            label: "Moneda",
            property: "MONEDA",
            type: EdmType.String,
          });
          aCols.push({
            label: "Fecha Solicitud",
            property: "FECHA",
            type: EdmType.Date,
          });
          aCols.push({
            label: "Fecha Pronto Pago",
            property: "FECHA_VENCIMIENTO",
            type: EdmType.Date,
          });
          aCols.push({
            label: "Estado",
            property: "es/DESCRIPCION",
            type: EdmType.String,
          });

          return aCols;
        },
        onFilter: function (oEvent) {
          let sSelectedKey = this.getView()
            .byId("iconTabBarSolicitudProntosPagos")
            .getSelectedKey();

          switch (sSelectedKey) {
            case "tabFilerPartidasAbiertas":
              this.partidasAbiertasFilter();
              break;
            case "tabFilerSolicitudes":
              this.solicitudesFilter();
              break;
            default:
              break;
          }
        },
        partidasAbiertasFilter: function () {
          let oView = this.getView();
          let oTable = oView.byId("PartidasAbiertasListTable");
          let aFilters = [];
          let bIsValid = true;

          let oFilter = this.preparePartidasFilter(aFilters, bIsValid);

          if (oFilter.bIsValid) {
            oTable.bindItems({
              path: "prontoPago>/ReadDocSet",
              template: oView.byId("PATableItemTemplate"),
              templateShareable: true,
              filters: oFilter.aFilters,
            });
          } else {
            MessageBox.error(
              "Error: Debe seleccionar una sociedad, proveedor y documento válido"
            );
          }
        },
        preparePartidasFilter: function (aFilters, bIsValid) {
       
          let oView = this.getView();
          let supplierValue = oView.byId("supplierInput").getValue();
          let supplier = supplierValue?.split("-")[0].trim(); // Para filtrar, obtengo el código.
          let society = oView.byId("societyCombo").getSelectedKey();
          let currency = oView.byId("currencyCombo").getSelectedKey();
          let document = oView.byId("documentInput").getValue();
          let initialDate = this.getView().byId("DRS1").getDateValue()?.toISOString();
          let finalDate = this.getView().byId("DRS1").getSecondDateValue()?.toISOString();

          if (supplier && society && document) {
            // Sociedad
            if (society) {
              aFilters.push(new Filter("Zbukrs", FilterOperator.EQ, society));
            }
            // Proveedor
            if (supplier) {
              aFilters.push(new Filter("Zlifnr", FilterOperator.EQ, supplier));
            }
            // Moneda
            if (currency) {
              aFilters.push(new Filter("Zwaers", FilterOperator.EQ, currency));
            }
            // Fecha 
            if (initialDate && finalDate) {
              aFilters.push(
                new Filter(
                  "Zfecha",
                  FilterOperator.BT,
                  initialDate,
                  finalDate
                )
              );
            }
            // Documento
            if (document) {
              aFilters.push(new Filter("Zbelnr", FilterOperator.EQ, document))
            }
            bIsValid = true;
          } else {
            bIsValid = false;
          }
          return {
            bIsValid: bIsValid,
            aFilters: aFilters
          }
        },
        solicitudesFilter: function () {
        
          let oView = this.getView()
          let aFilter = []
          let oTable = oView.byId("SolicitudesListTable")
          let supplierValue = oView.byId("supplierInput").getValue();
          let supplier = supplierValue?.split("-")[0].trim(); // Para filtrar, obtengo el código.
          let society = oView.byId("societyCombo").getSelectedKey();
          let currency = oView.byId("currencyCombo").getSelectedKey();
          let request = oView.byId("requestInput").getValue();
          let status = oView.byId("statusCombo").getSelectedKey();

          // Sociedad
          if (society) {
            aFilter.push(new Filter("SOCIETY", FilterOperator.EQ, society));
          };
          // Proveedor
          if (supplier) {
            aFilter.push(new Filter("SUPPLIER", FilterOperator.EQ, Number(supplier)));
          };
          // Moneda
          if (currency) {
            aFilter.push(new Filter("MONEDA", FilterOperator.EQ, currency))
          };
          //Estado
          if (status) {
            aFilter.push(new Filter("ID_ESTADO", FilterOperator.EQ, status))
          };
          //Solicitud
          if (request) {
            aFilter.push(new Filter("ID_SOLICITUD", FilterOperator.EQ, request))
          };

          oTable.getBinding("items").filter(aFilter)
        },
        handleSuggest: function (oEvent) {
          var sQuery = oEvent.getParameter("suggestValue");

          if (sQuery.length >= 3) {
            var oInput = this.byId("supplierInput");
            var aFilters = [];
            var oModelProntoPago = this.getView().getModel("prontoPago");
            var oSupplierModel = this.getView().getModel("supplierInput");

            // Crear los filtros
            aFilters.push(new sap.ui.model.Filter("Campo", sap.ui.model.FilterOperator.EQ, 'Proveedor'));
            aFilters.push(new sap.ui.model.Filter("Valor", sap.ui.model.FilterOperator.Contains, sQuery));

            oModelProntoPago.read("/MatchcodesSet", {
              filters: aFilters,
              success: function (data) {
                oSupplierModel.setData(data);
                oInput.bindAggregation("suggestionRows", {
                  path: "supplierInput>/results",
                  template: new sap.m.ColumnListItem({
                    cells: [
                      new sap.m.Label({ text: "{supplierInput>Valor}" }),
                      new sap.m.Label({ text: "{supplierInput>Descripcion}" })
                    ]
                  })
                });

              },
              error: function (oError) {
                console.log(oError);
              }
            });
          } else {
            this.getView().getModel("supplierInput").setData([]);
          }
        }
      }
    );
  }
);
