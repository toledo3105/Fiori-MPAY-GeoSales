sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/core/Fragment",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, AnalyticMap, JSONModel, Device, Fragment) {
    "use strict";
    AnalyticMap.GeoJSONURL = "./map/Mexico.JSON";
    var oThis;
    var sServiceUrl = "/sap/opu/odata/sap/ZCDS_VENTAS_DASHBOARD_CDS";
    var ODataModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, false);

    return Controller.extend("geosales.geosales.controller.Dashboard", {
      onInit: function () {
        // Obtener los datos consultando el OData
        ODataModel.bCanonicalRequests = true;
        ODataModel.setUseBatch(false);
        ODataModel.read(
          "/ZCDS_VENTAS_DASHBOARD(p_date=datetime'2023-12-20T00:00:00',p_date_h=datetime'2023-12-20T00:00:00',p_time_l=time'PT14H00M00S',p_time_h=time'PT14H00M50S')/Set",
          {
            urlParameters: {
              $expand: "to_Historico,to_Totales",
            },
            success: function (oSuccess) {
              // Llenar los objetos a parir de los datos obtenidos
              var counter = 0;
              var loSlideCelulares = new sap.m.SlideTile();
              var loSlidePrestamos = new sap.m.SlideTile();
              oSuccess.results[0].to_Totales.results.forEach((element) => {
                counter++;
                var lvIcon = "sap-icon://money-bills";
                var lvStyle = "";
                var lvStyle2 = "sapUiTinyMarginTop sapUiTinyMarginBegin";
                switch (element.Producto) {
                  case "Celulares":
                    lvIcon = "sap-icon://iphone";
                    lvStyle = lvStyle + " valueCelulares";
                    break;
                  case "Préstamo":
                    lvIcon = "sap-icon://loan";
                    lvStyle = lvStyle + " valuePrestamos";
                    element.Producto = element.Producto + "s";
                    break;
                }
                var lvIcon;
                var loNew = new sap.m.GenericTile({
                  header: element.Producto,
                  subheader: element.tipo_venta,
                  headerImage: lvIcon,
                  frameType: "TwoByOne",
                  tileContent: new sap.m.TileContent({
                    footer: element.Fecha,
                    content: new sap.m.FeedContent({ value: element.total }),
                  }),
                });
                loNew.addStyleClass(lvStyle);
                switch (element.Producto) {
                  case "Celulares":
                    loSlideCelulares.addTile(loNew);
                    if (counter == 2) {
                      loSlideCelulares.addStyleClass(lvStyle2);
                      oThis.byId("totalesProductos").addItem(loSlideCelulares);
                    }
                    break;
                  case "Préstamos":
                    loSlidePrestamos.addTile(loNew);

                    loSlidePrestamos.addStyleClass(lvStyle2);
                    oThis.byId("totalesProductos").addItem(loSlidePrestamos);

                    break;
                }
              });
              var lv_OData = "X";
            },
          }
        );

        //  Obtener Fragment para usarlo como plantilla
        var oThis = this;
        sap.ui.require(["sap/ui/core/Fragment"], function (Fragment) {
          Fragment.load({
            id: oThis.getView().getId(),
            name: "geosales.geosales.view.SlideTiles",
          }).then(function (oFragment) {});
        });

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
