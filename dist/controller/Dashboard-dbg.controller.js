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
    var gIds = {};
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

    // Consumir OData
    function odataConsume(oThis, iExpand) {
      const date = new Date();

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      let hour = date.getHours();
      let minute = date.getMinutes();
      let minuteH = date.getMinutes() + 1;

      var dateLow = year + "-" + month + "-" + day + "T00:00:00";
      var dateHigh = year + "-" + month + "-" + day + "T00:00:00";
      // var dateLow = "2024-03-06T00:00:00";
      // var dateHigh = "2024-03-06T00:00:00";
      var timeLow = "PT" + hour + "H" + minute + "M" + "00S";
      var timeHigh = "PT" + hour + "H" + minuteH + "M" + "00S";
      var urlBase =
        "/ZCDS_VENTAS_DASHBOARD(p_date=datetime'" +
        dateLow +
        "',p_date_h=datetime'" +
        dateHigh +
        "',p_time_l=time'" +
        timeLow +
        "',p_time_h=time'" +
        timeHigh +
        "')/Set";

      // var lexpand = "to_Totales,to_Recientes,to_TotalesEstado";
      var lexpand = iExpand;
      // Obtener los datos consultando el OData
      ODataModel.bCanonicalRequests = true;
      ODataModel.setUseBatch(false);
      ODataModel.read(urlBase, {
        urlParameters: {
          $expand: lexpand,
        },
        success: function (oSuccess) {
          fillTotales(oSuccess.results[0].to_Totales.results, oThis);
          //  Llenar estados que han registrado ventas
          fillEstatesWithSales(
            oSuccess.results[0].to_TotalesEstado.results,
            oThis
          );

          //  Llenar Recientes
          var listEstadosRecientes = fillRecentCards(
            oSuccess.results[0].to_Recientes.results,
            oThis
          );

          //  Llenar Regiones que registraron ventas en el último minuto
          fillRecentEstates(listEstadosRecientes, oThis);
        },
        error: function (oError) {},
      });
    }

    // Llenar Totales
    function fillTotales(iData, oThis) {
      var counter = 0;
      var len = iData.length;
      var IDs = [];
      iData.forEach((element) => {
        counter++;
        var lvIcon = "sap-icon://money-bills";
        var lvStyle = "";
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
        var lDate = iData[0].Fecha;
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
        if (len > 4) {
          if (element.Producto in lDic) {
            // Quitar comentario para agrupar Slides
            lDic[element.Producto] = lDic[element.Producto].addTile(loNew);
          } else {
            lDic[element.Producto] = new sap.m.SlideTile();
            var oLayout = new sap.f.GridContainerItemLayoutData();
            oLayout.setColumns(4);
            oLayout.setMinRows(2);
            lDic[element.Producto].setLayoutData(oLayout);
            lDic[element.Producto] = lDic[element.Producto].addTile(loNew);
          }
          if (counter == len) {
            for (let key in lDic) {
              oThis.byId("totalesProductos").addItem(lDic[key]);
            }
          }
        } else {
          var loSli = new sap.m.SlideTile();
          var oLayout = new sap.f.GridContainerItemLayoutData();
          oLayout.setColumns(4);
          oLayout.setMinRows(2);
          loSli.setLayoutData(oLayout);
          loSli.addTile(loNew);
          if (!gIds["totalesTop"]) {
            oThis.byId("totalesProductos").addItem(loSli);
            IDs.push(
              oThis.byId("totalesProductos").getItems()[counter - 1].getId()
            );
          } else {
            oThis
              .byId("totalesProductos")
              .getItems()
              [counter - 1].removeAllTiles();
            oThis
              .byId("totalesProductos")
              .getItems()
              [counter - 1].addTile(loNew);
          }
        }
      });
      gIds["totalesTop"] = IDs;
    }

    //  Llenar estados que han registrado ventas
    function fillEstatesWithSales(iData, oThis) {
      var listEstados = [];
      iData.forEach((element) => {
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
      });
      // Llenar Legends del Mapa
      oThis
        .byId("legend01")
        .setText(
          listEstados.length + " estados han registrado ventas el día de hoy"
        );
    }

    //  Llenar Regiones que registraron ventas en el último minuto
    function fillRecentEstates(iData, oThis) {
      iData.forEach((element) => {
        oThis.byId("vbi").addRegion(
          new sap.ui.vbm.Region({
            code: "MX-" + element,
            color: "#F1B434",
          })
        );
      });
      // Llenar Legends del Mapa
      oThis
        .byId("legend02")
        .setText(
          iData.length + " estados registraron ventas en el último minuto"
        );
    }

    function fillRecentCards(iData, oThis) {
      var counter = 1;
      var counterAux = 0;
      var lDic = {};
      var len = iData.length;
      var listEstadosRecientes = [];
      var IDs = [];
      iData.forEach((element) => {
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
            if (oCard.getContent()) {
              oCard.addStyleClass("sapUiSmallMarginBottom");
              if (!gIds["recentCards"]) {
                oThis.byId("listRecientes").addItem(oCard);
                oThis.byId("listRecientes").setLayoutData(oLay);
                IDs.push(
                  oThis.byId("listRecientes").getItems()[counter - 1].getId()
                );
              } else {
                oThis
                  .byId("listRecientes")
                  .getItems()
                  [counter - 1].destroyContent();

                oThis
                  .byId("listRecientes")
                  .getItems()
                  [counter - 1].setContent(lDic[counter]);
                // oThis.byId("listRecientes").setLayoutData(oLay);
              }
            }
            counter++;
          } while (counter <= 3);
        }
      });
      if (!gIds["recentCards"]) {
        gIds["recentCards"] = IDs;
      }

      return listEstadosRecientes;
    }

    return Controller.extend("geosales.geosales.controller.Dashboard", {
      onInit: function () {
        //  Obtener Fragment para usarlo como plantilla
        oThis = this;
        // setInterval(function () {
        //   odataConsume(this, "to_Totales,to_Recientes,to_TotalesEstado");
        // }, 20000);
        // Carga Inicial de datos
        odataConsume(oThis, "to_Totales,to_Recientes,to_TotalesEstado");

        // ODataModel.bCanonicalRequests = true;
        // ODataModel.setUseBatch(false);
        // ODataModel.read(
        //   "/ZCDS_VENTAS_DASHBOARD(p_date=datetime'2023-11-20T00:00:00',p_date_h=datetime'2023-11-20T00:00:00',p_time_l=time'PT12H00M00S',p_time_h=time'PT12H02M00S')/Set",
        //   // "/ZCDS_VENTAS_DASHBOARD(p_date=datetime'2023-03-20T00:00:00',p_date_h=datetime'2023-03-20T00:00:00',p_time_l=time'PT11H07M00S',p_time_h=time'PT11H08M00S')/Set",
        //   {
        //     urlParameters: {
        //       $expand: "to_Totales,to_Recientes,to_TotalesEstado",
        //     },
        //     success: function (oSuccess) {
        //       // Llenar totales
        //       fillTotales(oSuccess.results[0].to_Totales.results, oThis);
        //       //  Llenar estados que han registrado ventas
        //       fillEstatesWithSales(
        //         oSuccess.results[0].to_TotalesEstado.results,
        //         oThis
        //       );

        //       //  Llenar Recientes
        //       var listEstadosRecientes = fillRecentCards(
        //         oSuccess.results[0].to_Recientes.results,
        //         oThis
        //       );

        //       //  Llenar Regiones que registraron ventas en el último minuto
        //       fillRecentEstates(listEstadosRecientes, oThis);
        //     },
        //   }
        // );
        // ----------------------------------------------------------------------

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
      onBeforeRendering: function () {
        // Ciclos de 1 minuto para actualizar objetos
        setInterval(function () {
          odataConsume(oThis, "to_Totales,to_Recientes,to_TotalesEstado");
        }, 60000);
      },
      // formatCountry: function (oValue) {
      //   var lv_v = oValue;
      // },
    });
  }
);
