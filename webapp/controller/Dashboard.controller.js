sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, AnalyticMap, JSONModel, Device) {
    "use strict";
    AnalyticMap.GeoJSONURL = "./map/Mexico.JSON";
    return Controller.extend("geosales.geosales.controller.Dashboard", {
      onInit: function () {
        // var OData = {
        //   Regions: [
        //     {
        //       country: "CDMX",
        //       code: "MX-CDMX",
        //       color: "rgb(27,126,172)",
        //     },
        //   ],
        // };

        var oModel = new JSONModel("./data/states.json");
        this.getView().setModel(oModel);

        var oDeviceModel = new JSONModel(Device);
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.getView().setModel(oDeviceModel, "device");

        oModel.attachRequestCompleted(function (oEvent) {
          var lvX = "X";
        });
      },

      formatCountry: function (oValue) {
        var lv_v = oValue;
      },
    });
  }
);
