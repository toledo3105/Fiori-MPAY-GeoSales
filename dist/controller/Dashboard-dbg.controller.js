sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/core/Fragment",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/format/NumberFormat",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    AnalyticMap,
    JSONModel,
    Device,
    Fragment,
    DateFormat,
    NumberFormat
  ) {
    "use strict";
    AnalyticMap.GeoJSONURL = "./map/Mexico.JSON";
    var oThis;
    var sServiceUrl = "/sap/opu/odata/sap/ZCDS_VENTAS_DASHBOARD_CDS";
    var ODataModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, false);
    var oDateFormat = DateFormat.getDateInstance({
      style: "medium",
      UTC: true,
    });

    var oCurrencyFormat = NumberFormat.getCurrencyInstance({
      decimalSeparator: ".",
      groupingSeparator: ",",
    });

    return Controller.extend("geosales.geosales.controller.Dashboard", {
      onInit: function () {
        //  Obtener Fragment para usarlo como plantilla
        var oThis = this;

        // Obtener los datos consultando el OData
        ODataModel.bCanonicalRequests = true;
        ODataModel.setUseBatch(false);
        ODataModel.read(
          // "/ZCDS_VENTAS_DASHBOARD(p_date=datetime'2024-03-06T00:00:00',p_date_h=datetime'2024-03-06T00:00:00',p_time_l=time'PT12H00M00S',p_time_h=time'PT12H30M00S')/Set",
          "/ZCDS_VENTAS_DASHBOARD(p_date=datetime'2023-03-20T00:00:00',p_date_h=datetime'2023-03-20T00:00:00',p_time_l=time'PT12H01M00S',p_time_h=time'PT12H02M00S')/Set",
          {
            urlParameters: {
              $expand: "to_Totales,to_Recientes,to_TotalesEstado",
            },
            success: function (oSuccess) {
              // Llenar los objetos a partir de los datos obtenidos
              var counter = 0;
              var loSlide = new sap.m.SlideTile();
              var lDic = {};
              var len = oSuccess.results[0].to_Totales.results.length;
              var heightMap = oThis.byId("totalesProductos");

              // Llenar totales
              oSuccess.results[0].to_Totales.results.forEach((element) => {
                counter++;
                var lvIcon = "sap-icon://money-bills";
                var lvStyle = "";
                // var lvStyle2 = "sapUiSmallMarginTop sapUiSmallMarginBegin";
                var lvStyle2 = "sapUiSmallMargin";
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
                  case "Motos":
                    lvIcon = "sap-icon://bus-public-transport";
                    lvStyle = lvStyle + " valueMotos";
                    break;
                }
                var lvIcon;
                var lDate = oSuccess.results[0].p_date;
                var loNew = new sap.m.GenericTile({
                  header: element.Producto,
                  subheader: element.tipo_venta,
                  headerImage: lvIcon,
                  frameType: "TwoByOne",

                  tileContent: new sap.m.TileContent({
                    footer: oDateFormat.format(lDate),
                    content: new sap.m.FeedContent({ value: element.total }),
                  }),
                });
                loNew.addStyleClass(lvStyle);
                // if (element.Producto in lDic) {
                //   // Quitar comentario para agrupar Slides
                //   lDic[element.Producto] =
                //     lDic[element.Producto].addTile(loNew);
                // } else {
                //   lDic[element.Producto] = new sap.m.SlideTile();
                //   var oLayout = new sap.f.GridContainerItemLayoutData();
                //   oLayout.setColumns(4);
                //   oLayout.setMinRows(2);
                //   lDic[element.Producto].setLayoutData(oLayout);
                //   lDic[element.Producto] =
                //     lDic[element.Producto].addTile(loNew);
                // }
                // if (counter == len) {
                //   for (let key in lDic) {
                //     oThis.byId("totalesProductos").addItem(lDic[key]);
                //   }
                // }
                var loSli = new sap.m.SlideTile();
                var oLayout = new sap.f.GridContainerItemLayoutData();
                oLayout.setColumns(4);
                oLayout.setMinRows(2);
                loSli.setLayoutData(oLayout);
                loSli.addTile(loNew);
                oThis.byId("totalesProductos").addItem(loSli);
              });
              //  Llenar Regiones en el Mapa
              var listEstados = [];
              oSuccess.results[0].to_TotalesEstado.results.forEach(
                (element) => {
                  oThis.byId("vbi").addRegion(
                    new sap.ui.vbm.Region({
                      tooltip: element.DescEstado,
                      code: "MX-" + element.Estado,
                      color: "#1b7eac",
                    })
                  );
                  if (listEstados.find((fnd) => fnd == element.Estado)) {
                  } else {
                    listEstados.push(element.Estado);
                  }
                }
              );
              //  Llenar Recientes
              counter = 1;
              var counterAux = 0;
              lDic = {};
              len = oSuccess.results[0].to_Recientes.results.length;
              var listEstadosRecientes = [];
              oSuccess.results[0].to_Recientes.results.forEach((element) => {
                if (listEstadosRecientes.find((fnd) => fnd == element.Estado)) {
                } else {
                  listEstadosRecientes.push(element.Estado);
                }
                var loItem = new sap.m.GenericTile({
                  header: element.Producto,
                  subheader: element.tipo_venta,
                  frameType: "OneByOne",

                  tileContent: new sap.m.TileContent({
                    footer: element.DescEstado,
                    content: new sap.m.NumericContent({
                      icon: "sap-icon://iphone",
                      value: element.total,
                      withMargin: false,
                    }),
                  }),
                });
                counterAux += 1;
                loItem.addStyleClass("iconCelulares");
                loItem.addStyleClass("myHeaderTile");

                var oLay = new sap.f.GridContainerItemLayoutData();
                oLay.setColumns(2);
                oLay.setMinRows(2);
                if (counterAux <= 3) {
                  lDic[counter] = new sap.m.SlideTile();
                  lDic[counter].addTile(loItem);
                  counter++;
                } else {
                  if (counter > 3) {
                    counter = 1;
                  }
                  lDic[counter].addTile(loItem);
                  counter++;
                }

                if (counterAux == len) {
                  counter = 1;
                  do {
                    var oCard = new sap.f.Card();

                    oCard.setContent(lDic[counter]);
                    oCard.addCustomData(
                      new sap.m.BadgeCustomData({
                        value: "Nueva venta",
                      })
                    );
                    oCard.addStyleClass("sapUiSmallMarginBottom");
                    oThis.byId("listRecientes").addItem(oCard);
                    oThis.byId("listRecientes").setLayoutData(oLay);
                    counter++;
                  } while (counter <= 3);
                }
              });

              // Llenar Legends del Mapa
              oThis
                .byId("legend02")
                .setText(
                  listEstadosRecientes.length +
                    " estados registraron ventas en el último minuto"
                );

              // Llenar Legends del Mapa
              oThis
                .byId("legend01")
                .setText(
                  listEstados.length +
                    " estados han registrado ventas el día de hoy"
                );

              //  Llenar Regiones Recientes en el Mapa

              listEstadosRecientes.forEach((element) => {
                oThis.byId("vbi").addRegion(
                  new sap.ui.vbm.Region({
                    code: "MX-" + element,
                    // color: "rgb(27,126,172)",
                    color: "#F1B434",
                  })
                );
              });

              // Llenar Spots
              // var loID = oThis.byId("wdfSpot").getParent().aUniqueIdx[0];
              // var oModelStates = new JSONModel(
              //   "./data/mexicostatesCoordinates.json"
              // );
              // oThis.getView().setModel(oModelStates);
              // oModelStates.attachRequestCompleted(function (oEvent) {
              //   var lEstates = oEvent.getSource().getData();
              //   listEstadosRecientes.forEach((element) => {
              //     var loSpot = new sap.ui.vbm.Spot();
              //     // loSpot.setPosition(
              //     //   lEstates[element].lng + ";" + lEstates[element].lat + ";00"
              //     // );
              //     loSpot.setPosition("-99.151884;19.441647;00");
              //     loSpot.setIcon("sap-icon://unfavorite");
              //     oThis.byId(loID).addItem(loSpot);
              //   });
              // });

              // oThis.getView().setModel(oModel);
              //
            },
          }
        );

        // sap.ui.require(["sap/ui/core/Fragment"], function (Fragment) {
        //   Fragment.load({
        //     id: oThis.getView().getId(),
        //     name: "geosales.geosales.view.SlideTiles",
        //   }).then(function (oFragment) {});
        // });

        // var oModel = new JSONModel("./data/states.json");
        // this.getView().setModel(oModel);

        // var oDeviceModel = new JSONModel(Device);
        // oDeviceModel.setDefaultBindingMode("OneWay");
        // this.getView().setModel(oDeviceModel, "device");

        // oModel.attachRequestCompleted(function (oEvent) {
        //   var lvX = "X";
        // });
      },

      // formatCountry: function (oValue) {
      //   var lv_v = oValue;
      // },
    });
  }
);
