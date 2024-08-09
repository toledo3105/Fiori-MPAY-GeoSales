sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/vbm/AnalyticMap",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/core/Fragment",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/format/NumberFormat",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/ui/core/date/UI5Date",
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
    NumberFormat,
    ChartFormatter,
    UI5Date
  ) {
    "use strict";
    AnalyticMap.GeoJSONURL = "./map/Mexico.JSON";
    var oThis;
    var gIds = {};
    var sServiceUrl = "/sap/opu/odata/sap/ZCDS_VENTAS_DASHBOARD_CDS";
    var sServiceUrlTop = "/sap/opu/odata/sap/ZCDS_TOPVENTASXREG_CDS";
    var sServiceUrlGraph = "/sap/opu/odata/sap/ZCDS_VENTASXMES_SPLIT_CDS";
    var ODataModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, false);
    var ODataModelTop = new sap.ui.model.odata.v2.ODataModel(
      sServiceUrlTop,
      false
    );
    var ODataModelGraph = new sap.ui.model.odata.v2.ODataModel(
      sServiceUrlGraph,
      false
    );
    var oDateFormat = DateFormat.getDateInstance({
      style: "medium",
      UTC: true,
    });

    var oCurrencyFormat = NumberFormat.getCurrencyInstance({
      decimalSeparator: ".",
      groupingSeparator: ",",
      decimals: 0,
    });

    // Fechas para consumir Servicios OData
    var date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    // let year = "2023";

    let hour = date.getHours();
    let minuteH = date.getMinutes();
    let secondsH = date.getSeconds();
    var timeHigh = "PT" + hour + "H" + minuteH + "M" + "00S";
    var dateHigh = year + "-" + month + "-" + day + "T00:00:00";
    // var dateHigh = "2023-05-10T00:00:00";

    var dateL = new Date(new Date() - 30000);
    let hourL = dateL.getHours();
    let minute = dateL.getMinutes();
    let secondsL = dateL.getSeconds();

    var timeLow = "PT" + hourL + "H" + minute + "M" + secondsL + "S";
    var dateLow = year + "-" + month + "-" + day + "T00:00:00";
    // var dateLow = "2024-08-05T00:00:00";

    // Actualizar Horas
    function updateTime() {
      date = new Date();
      hour = date.getHours();
      minuteH = date.getMinutes();
      secondsH = date.getSeconds();
      timeHigh = "PT" + hour + "H" + minuteH + "M" + secondsH + "S";

      dateL = new Date(new Date() - 30000);
      hourL = dateL.getHours();
      minute = dateL.getMinutes();
      secondsL = dateL.getSeconds();
      timeLow = "PT" + hourL + "H" + minute + "M" + secondsL + "S";
      // timeLow = "PT18H42M00S";
      // timeHigh = "PT18H43M00S";
      oThis
        .byId("Time")
        .setText(hour + ":" + (minuteH < 10 ? "0" + minuteH : minuteH));
    }

    // Consumir OData
    function odataConsume(oThis, iExpand) {
      updateTime();
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
          // fillTotales(oSuccess.results[0].to_Totales.results, oThis);
          totalesBinding(oSuccess.results[0].to_Totales, oThis);
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

          fillBall(oThis, oSuccess.results[0].to_ComparativoDays.results);
          fillTopEstados(oThis, []);
          fillMotnhsGraph(oThis);
        },
        error: function (oError) {},
      });
    }
    // Llenar Totales con Binding
    function totalesBinding(iData, oThis) {
      var oScnModel = new JSONModel(iData);
      oThis.byId("totalesBinding").setModel(oScnModel, "data");
    }

    // Llenar Totales
    function fillTotales(iData, oThis) {
      var counter = 0;
      var len = iData.length;
      var IDs = [];
      oThis.byId("totalesProductos").destroyItems();
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
            lvStyle = lvStyle + "valuePrestamos";
            element.Producto = element.Producto + "s";
            break;
          case "Motos":
            // lvIcon = "sap-icon://bus-public-transport";
            lvIcon = "images/motorbike.png";
            lvStyle = lvStyle + " valueMotos";
            break;
          case "Bicicleta":
            lvIcon = "images/e_bike.png";
            lvStyle = lvStyle + "valueBicis";
            element.Producto = element.Producto + "s";
            break;
          case "iPhone":
            lvIcon = "images/iphone.png";
            lvStyle = lvStyle + "valueiPhone";
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
        // if (len > 4) {
        //   if (element.Producto in lDic) {
        //     // Quitar comentario para agrupar Slides
        //     lDic[element.Producto] = lDic[element.Producto].addTile(loNew);
        //   } else {
        //     lDic[element.Producto] = new sap.m.SlideTile();
        //     var oLayout = new sap.f.GridContainerItemLayoutData();
        //     oLayout.setColumns(4);
        //     oLayout.setMinRows(2);
        //     lDic[element.Producto].setLayoutData(oLayout);
        //     lDic[element.Producto] = lDic[element.Producto].addTile(loNew);
        //   }
        //   if (counter == len) {
        //     for (let key in lDic) {
        //       oThis.byId("totalesProductos").addItem(lDic[key]);
        //     }
        //   }
        // } else {
        var loSli = new sap.m.SlideTile();
        var oLayout = new sap.f.GridContainerItemLayoutData();
        oLayout.setColumns(3);
        oLayout.setMinRows(2);
        loSli.setLayoutData(oLayout);
        loSli.addStyleClass("mySlide");
        loSli.addTile(loNew);
        // if (!gIds["totalesTop"]) {
        oThis.byId("totalesProductos").addItem(loSli);
        IDs.push(
          oThis.byId("totalesProductos").getItems()[counter - 1].getId()
        );
        // } else {
        //   oThis
        //     .byId("totalesProductos")
        //     .getItems()
        //     [counter - 1].removeAllTiles();
        //   oThis
        //     .byId("totalesProductos")
        //     .getItems()
        //     [counter - 1].addTile(loNew);
        // }
        // }
      });
      // gIds["totalesTop"] = IDs;
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
        .setText(iData.length + " estados registraron ventas recientemente");
    }

    function fillRecentCards(iData, oThis) {
      var counter = 1;
      var counterAux = 0;
      var lDic = {};
      // var len = iData.length;
      var listEstadosRecientes = [];
      var IDs = [];
      var iDataAux = [];
      var defTile = oThis.byId("sinVentasTile");
      oThis.byId("listRecientes").destroyItems();
      if (iData.length > 0) {
        oThis.byId("listRecientes").setVisible(true);
        oThis.byId("sinVentasTile").setVisible(false);
        iData.forEach((element) => {
          if (
            !iDataAux.find(
              (fnd) =>
                fnd.Estado == element.Estado &&
                fnd.Producto == element.Producto &&
                fnd.tipo_venta == element.tipo_venta
            )
          ) {
            iDataAux.push(element);
          } else {
            var index = iDataAux.findIndex(
              (fnd) =>
                fnd.Estado == element.Estado &&
                fnd.Producto == element.Producto &&
                fnd.tipo_venta == element.tipo_venta
            );
            iDataAux[index].total++;
          }
        });
        var len = iDataAux.length;
        iDataAux.forEach((element) => {
          if (listEstadosRecientes.find((fnd) => fnd == element.Estado)) {
          } else {
            listEstadosRecientes.push(element.Estado);
          }
          var lvStyle = "";
          var lvIcon = "";
          switch (element.Producto) {
            case "Celulares":
              lvIcon = "sap-icon://iphone";
              // lvStyle = lvStyle + "valueCelularesNC";
              break;
            case "Préstamo":
              lvIcon = "sap-icon://loan";
              // lvStyle = lvStyle + "valuePrestamosNC";
              element.Producto = element.Producto + "s";
              break;
            case "Motos":
              lvIcon = "images/motorbike.png";
              // lvStyle = lvStyle + "valueMotosNC";
              break;
            case "Bicicleta":
              lvIcon = "images/e_bike.png";
              // lvStyle = lvStyle + " valueBicis";
              element.Producto = element.Producto + "s";
              break;
            case "Accesorio":
              lvIcon = "sap-icon://headset";
              break;
          }
          var loNumeric = new sap.m.NumericContent({
            // id: "tile" + element.Estado,
            icon: lvIcon,
            value: element.total,
            withMargin: false,
          });
          loNumeric.addStyleClass(lvStyle);
          var loItem = new sap.m.GenericTile({
            header: element.Producto,
            subheader: element.tipo_venta,
            frameType: "OneByOne",

            tileContent: new sap.m.TileContent({
              footer: element.DescEstado,
              content: loNumeric,
            }),
          });
          counterAux += 1;
          // loItem.addStyleClass(lvStyle);
          // loItem.addStyleClass("myHeaderTile");
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
                // if (gIds["recentCards"]) {
                //   var lenCards = gIds["recentCards"].length;
                // } else {
                //   lenCards = 0;
                // }
                if (!gIds["recentCards"]) {
                  oThis.byId("listRecientes").addItem(oCard);
                  // IDs.push(
                  //   oThis.byId("listRecientes").getItems()[counter - 1].getId()
                  // );
                } else {
                  oThis
                    .byId("listRecientes")
                    .getItems()
                    [counter - 1].destroyContent();

                  oThis
                    .byId("listRecientes")
                    .getItems()
                    [counter - 1].setContent(lDic[counter]);
                }
              }
              counter++;
            } while (counter <= 3);
          }
        });
        if (!gIds["rexcentCards"]) {
          // gIds["recentCards"] = IDs;
        }
      } else {
        oThis.byId("listRecientes").setVisible(false);
        oThis.byId("sinVentasTile").setVisible(true);
      }
      return listEstadosRecientes;
    }

    // Llenar Estados Top
    function fillTopEstados(oThis, iData) {
      // Obtener los datos consultando el OData
      var urlBase =
        "/ZCDS_TOPVENTASXREG(p_fecha=datetime'" + dateLow + "')/Set";
      ODataModelTop.bCanonicalRequests = true;
      ODataModelTop.setUseBatch(false);
      ODataModelTop.read(urlBase, {
        success: function (oSuccess) {
          oThis.byId("topEstados").destroyBars();
          oSuccess.results.forEach((element) => {
            oThis.byId("topEstados").addBar(
              new sap.suite.ui.microchart.InteractiveBarChartBar({
                label: element.bezei,
                value: parseFloat(element.registros),
              })
            );
          });
        },
        error: function (oError) {},
      });
    }

    // Llenar gráfica de ventas
    function fillBall(oThis, iData) {
      oThis.byId("ballChart1").setTotal(iData[0].venta_anio_anterior);
      oThis.byId("ballChart2").setFraction(iData[0].venta_Actual);
      oThis.byId("fechaBall1").setText(oDateFormat.format(iData[0].fecha));
      oThis
        .byId("fechaBall2")
        .setText(oDateFormat.format(iData[0].fecha_Anterior));
    }

    // Llenar gráfica de meses
    function fillMotnhsGraph(oThis) {
      // Formato de Números
      var oVizFrame = oThis.byId("idVizFrame");
      var FIORI_PERCENTAGE_FORMAT_2 = "__UI5__PercentageMaxFraction2";

      var chartFormatter = ChartFormatter.getInstance();
      chartFormatter.registerCustomFormatter(
        FIORI_PERCENTAGE_FORMAT_2,
        function (value) {
          return oCurrencyFormat.format(value);
        }
      );

      //apply
      sap.viz.ui5.api.env.Format.numericFormatter(chartFormatter);
      // Obtener los datos consultando el OData
      var urlBase = "/ZCDS_VENTASXMES_SPLIT(p_anio='" + year + "')/Set";
      ODataModelGraph.bCanonicalRequests = true;
      ODataModelGraph.setUseBatch(false);
      ODataModelGraph.read(urlBase, {
        urlParameters: {
          $orderby: "Anio,Mes asc",
        },
        success: function (oSuccess) {
          var oScnModel = new JSONModel(oSuccess);
          oThis.byId("idVizFrame").setModel(oScnModel, "myModel");

          // oThis.byId("totalesBinding").setModel(oScnModel, "data");
        },
        error: function (oError) {},
      });
    }

    return Controller.extend("geosales.geosales.controller.Dashboard", {
      _data: {
        date: UI5Date.getInstance(),
      },
      onInit: function () {
        //  Obtener Fragment para usarlo como plantilla
        var oModel = new JSONModel(this._data);
        this.getView().setModel(oModel);
        oThis = this;
        odataConsume(
          oThis,
          "to_Totales,to_Recientes,to_TotalesEstado,to_ComparativoDays"
        );
      },
      onBeforeRendering: function () {
        // Ciclos de 1 minuto para actualizar objetos
        setInterval(function () {
          odataConsume(
            oThis,
            "to_Totales,to_Recientes,to_TotalesEstado,to_ComparativoDays"
          );
        }, 30000);
      },
      formatNumber: function (oNumber1) {
        return sap.ui.core.format.NumberFormat.getPercentInstance({
          style: "precent",
          maxFractionDigits: 2,
        }).format(oNumber1);
      },
      formatIcon: function (producto) {
        var lvIcon = "";
        switch (producto) {
          case "Celulares":
            lvIcon = "sap-icon://iphone";
            break;
          case "Préstamo":
            lvIcon = "sap-icon://loan";
            break;
          case "Motos":
            lvIcon = "images/motorbike.png";
            break;
          case "Bicicleta":
            lvIcon = "images/e_bike.png";
            break;
          case "iPhone":
            lvIcon = "images/iphone.png";
            break;
          case "Accesorio":
            lvIcon = "sap-icon://headset";
            break;
        }
        return lvIcon;
      },

      formatStyle: function (producto) {
        var lvIcon = "";
        switch (producto) {
          case "Celulares":
            lvIcon = "valueCelulares";
            break;
          case "Préstamo":
            lvIcon = "valuePrestamos";
            break;
        }
        return lvIcon;
      },

      formatProducto: function (producto) {
        var lvIcon = "";
        switch (producto) {
          case "Bicicleta":
            lvIcon = producto + "s";
            break;
          case "Préstamo":
            lvIcon = producto + "s";
            break;
          case "Accesorio":
            lvIcon = producto + "s";
            break;
          default:
            lvIcon = producto;
        }
        return lvIcon;
      },
    });
  }
);
