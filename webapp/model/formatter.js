sap.ui.define(["sap/ui/core/format/NumberFormat"], function (NumberFormat) {
  "use strict";
  return {
    statusColor: function (sProperty) {
      switch (sProperty) {
        case 1:
          return "Warning";
        case 2:
          return "Error";
        case 3:
          return "None";
        case 4:
          return "Success";
        case 5:
          return "Success";
        default:
          return "None";
      }
    },
    formatDate: function (date) {
      var formattedDate = new Date(date);
      var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
        pattern: "dd/MM/yyyy",
        UTC: true,
      });
      return oDateFormat.format(formattedDate);
    },
    formatNumber: function (number) {
      var oFloatNumberFormat = NumberFormat.getFloatInstance({
        maxFractionDigits: 2,
        groupingEnabled: true,
        groupingSeparator: ",",
        groupingSize: 3,
        decimalSeparator: ".",
        decimals: 2,
      });
      return oFloatNumberFormat.format(number);
    },
    formatStatus: function (status) {
      switch (status) {
        case 1:
          return "Pendiente";
        case 2:
          return "Rechazada";
        case 3:
          return "Cancelada";
        case 4:
          return "Pronto pago";
        case 5:
          return "Finalizada";
        default:
          return "None";
      }
    },
    formatEmailApprover: function (aApprovers) {
      let sEmails = "";
      for (let i = 0; i < aApprovers.length; i++) {
        if (aApprovers.length > 1) {
          if (i === aApprovers.length) {
            sEmails = sEmails + aApprovers[i].MAIL;
          } else {
            sEmails = sEmails + aApprovers[i].MAIL + "-";
          }
        } else {
          sEmails = aApprovers[i].MAIL;
        }
      }
      return sEmails;
    },
    formatValorInputValue: function (Valor) {
      let iValor = Valor.replace(/^(0+)/g, ""); // Para quitar los '0' del principio.
      return iValor;
    },
    formatDescripcionInputValue: function (Descripcion) {
      let sDescripcionUpper = Descripcion?.toUpperCase();
      return sDescripcionUpper;
    },
    showFooter: function (sRelanzado) {
      return sRelanzado === "1";
    },

    isFooterVisible: function (RELANZADO, ID_ESTADO) {
      return parseInt(RELANZADO, 10) === 0 && parseInt(ID_ESTADO, 10) === 2;
    }
  };
});
