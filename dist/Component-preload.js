//@ui5-bundle geosales/geosales/Component-preload.js
sap.ui.require.preload({
	"geosales/geosales/Component.js":function(){
sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","geosales/geosales/model/models"],function(e,t,i){"use strict";return e.extend("geosales.geosales.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"geosales/geosales/controller/App.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("geosales.geosales.controller.App",{onInit(){}})});
},
	"geosales/geosales/controller/Dashboard.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/vbm/AnalyticMap","sap/ui/model/json/JSONModel","sap/ui/Device","sap/ui/core/Fragment","sap/ui/core/format/DateFormat","sap/ui/core/format/NumberFormat","sap/viz/ui5/format/ChartFormatter","sap/ui/core/date/UI5Date"],function(e,a,t,s,o,r,n,i,c){"use strict";a.GeoJSONURL="./map/Mexico.JSON";var l;var d={};var u="/sap/opu/odata/sap/ZCDS_VENTAS_DASHBOARD_CDS";var m="/sap/opu/odata/sap/ZCDS_TOPVENTASXREG_CDS";var v="/sap/opu/odata/sap/ZCDS_VENTASXMES_SPLIT_CDS";var p=new sap.ui.model.odata.v2.ODataModel(u,false);var f=new sap.ui.model.odata.v2.ODataModel(m,false);var b=new sap.ui.model.odata.v2.ODataModel(v,false);var g=r.getDateInstance({style:"medium",UTC:true});var h=n.getCurrencyInstance({decimalSeparator:".",groupingSeparator:",",decimals:0});var y=new Date;let _=y.getDate();let C=y.getMonth()+1;let I=y.getFullYear();let S=y.getHours();let T=y.getMinutes();let P=y.getSeconds();var D="PT"+S+"H"+T+"M"+"00S";var w=I+"-"+C+"-"+_+"T00:00:00";var M=new Date(new Date-3e4);let E=M.getHours();let k=M.getMinutes();let B=M.getSeconds();var R="PT"+E+"H"+k+"M"+B+"S";var F=I+"-"+C+"-"+_+"T00:00:00";function A(){y=new Date;S=y.getHours();T=y.getMinutes();P=y.getSeconds();D="PT"+S+"H"+T+"M"+P+"S";M=new Date(new Date-3e4);E=M.getHours();k=M.getMinutes();B=M.getSeconds();R="PT"+E+"H"+k+"M"+B+"S";l.byId("Time").setText(S+":"+(T<10?"0"+T:T))}function V(e,a){A();var t="/ZCDS_VENTAS_DASHBOARD(p_date=datetime'"+F+"',p_date_h=datetime'"+w+"',p_time_l=time'"+R+"',p_time_h=time'"+D+"')/Set";var s=a;p.bCanonicalRequests=true;p.setUseBatch(false);p.read(t,{urlParameters:{$expand:s},success:function(a){N(a.results[0].to_Totales,e);x(a.results[0].to_TotalesEstado.results,e);var t=U(a.results[0].to_Recientes.results,e);H(t,e);X(e,a.results[0].to_ComparativoDays.results);G(e,[]);Z(e)},error:function(e){}})}function N(e,a){var s=new t(e);a.byId("totalesBinding").setModel(s,"data")}function O(e,a){var t=0;var s=e.length;var o=[];a.byId("totalesProductos").destroyItems();e.forEach(s=>{t++;var r="sap-icon://money-bills";var n="";var i="sapUiSmallMargin";switch(s.Producto){case"Celulares":r="sap-icon://iphone";n=n+" valueCelulares";break;case"Préstamo":r="sap-icon://loan";n=n+"valuePrestamos";s.Producto=s.Producto+"s";break;case"Motos":r="images/motorbike.png";n=n+" valueMotos";break;case"Bicicleta":r="images/e_bike.png";n=n+"valueBicis";s.Producto=s.Producto+"s";break;case"iPhone":r="images/iphone.png";n=n+"valueiPhone";break}var r;var c=e[0].Fecha;var l=new sap.m.GenericTile({header:s.Producto,subheader:s.tipo_venta,headerImage:r,frameType:"TwoByOne",tileContent:new sap.m.TileContent({footer:g.format(c),content:new sap.m.FeedContent({value:s.total})})});l.addStyleClass(n);var d=new sap.m.SlideTile;var u=new sap.f.GridContainerItemLayoutData;u.setColumns(3);u.setMinRows(2);d.setLayoutData(u);d.addStyleClass("mySlide");d.addTile(l);a.byId("totalesProductos").addItem(d);o.push(a.byId("totalesProductos").getItems()[t-1].getId())})}function x(e,a){var t=[];e.forEach(e=>{a.byId("vbi").addRegion(new sap.ui.vbm.Region({tooltip:e.DescEstado,code:"MX-"+e.Estado,color:"#1b7eac"}));if(t.find(a=>a==e.Estado)){}else{t.push(e.Estado)}});a.byId("legend01").setText(t.length+" estados han registrado ventas el día de hoy")}function H(e,a){e.forEach(e=>{a.byId("vbi").addRegion(new sap.ui.vbm.Region({code:"MX-"+e,color:"#F1B434"}))});a.byId("legend02").setText(e.length+" estados registraron ventas recientemente")}function U(e,a){var t=1;var s=0;var o={};var r=[];var n=[];var i=[];var c=a.byId("sinVentasTile");a.byId("listRecientes").destroyItems();if(e.length>0){a.byId("listRecientes").setVisible(true);a.byId("sinVentasTile").setVisible(false);e.forEach(e=>{if(!i.find(a=>a.Estado==e.Estado&&a.Producto==e.Producto&&a.tipo_venta==e.tipo_venta)){i.push(e)}else{var a=i.findIndex(a=>a.Estado==e.Estado&&a.Producto==e.Producto&&a.tipo_venta==e.tipo_venta);i[a].total++}});var l=i.length;i.forEach(e=>{if(r.find(a=>a==e.Estado)){}else{r.push(e.Estado)}var n="";var i="";switch(e.Producto){case"Celulares":i="sap-icon://iphone";break;case"Préstamo":i="sap-icon://loan";e.Producto=e.Producto+"s";break;case"Motos":i="images/motorbike.png";break;case"Bicicleta":i="images/e_bike.png";e.Producto=e.Producto+"s";break;case"Accesorio":i="sap-icon://headset";break}var c=new sap.m.NumericContent({icon:i,value:e.total,withMargin:false});c.addStyleClass(n);var u=new sap.m.GenericTile({header:e.Producto,subheader:e.tipo_venta,frameType:"OneByOne",tileContent:new sap.m.TileContent({footer:e.DescEstado,content:c})});s+=1;if(s<=3){o[t]=new sap.m.SlideTile;o[t].addTile(u);t++}else{if(t>3){t=1}o[t].addTile(u);t++}if(s==l){t=1;do{var m=new sap.f.Card;m.setContent(o[t]);m.addCustomData(new sap.m.BadgeCustomData({value:"Nueva venta"}));if(m.getContent()){m.addStyleClass("sapUiSmallMarginBottom");if(!d["recentCards"]){a.byId("listRecientes").addItem(m)}else{a.byId("listRecientes").getItems()[t-1].destroyContent();a.byId("listRecientes").getItems()[t-1].setContent(o[t])}}t++}while(t<=3)}});if(!d["rexcentCards"]){}}else{a.byId("listRecientes").setVisible(false);a.byId("sinVentasTile").setVisible(true)}return r}function G(e,a){var t="/ZCDS_TOPVENTASXREG(p_fecha=datetime'"+F+"')/Set";f.bCanonicalRequests=true;f.setUseBatch(false);f.read(t,{success:function(a){e.byId("topEstados").destroyBars();a.results.forEach(a=>{e.byId("topEstados").addBar(new sap.suite.ui.microchart.InteractiveBarChartBar({label:a.bezei,value:parseFloat(a.registros)}))})},error:function(e){}})}function X(e,a){e.byId("ballChart1").setTotal(a[0].venta_anio_anterior);e.byId("ballChart2").setFraction(a[0].venta_Actual);e.byId("fechaBall1").setText(g.format(a[0].fecha));e.byId("fechaBall2").setText(g.format(a[0].fecha_Anterior))}function Z(e){var a=e.byId("idVizFrame");var s="__UI5__PercentageMaxFraction2";var o=i.getInstance();o.registerCustomFormatter(s,function(e){return h.format(e)});sap.viz.ui5.api.env.Format.numericFormatter(o);var r="/ZCDS_VENTASXMES_SPLIT(p_anio='"+I+"')/Set";b.bCanonicalRequests=true;b.setUseBatch(false);b.read(r,{urlParameters:{$orderby:"Anio,Mes asc"},success:function(a){var s=new t(a);e.byId("idVizFrame").setModel(s,"myModel")},error:function(e){}})}return e.extend("geosales.geosales.controller.Dashboard",{_data:{date:c.getInstance()},onInit:function(){var e=new t(this._data);this.getView().setModel(e);l=this;V(l,"to_Totales,to_Recientes,to_TotalesEstado,to_ComparativoDays")},onBeforeRendering:function(){setInterval(function(){V(l,"to_Totales,to_Recientes,to_TotalesEstado,to_ComparativoDays")},3e4)},formatNumber:function(e){return sap.ui.core.format.NumberFormat.getPercentInstance({style:"precent",maxFractionDigits:2}).format(e)},formatIcon:function(e){var a="";switch(e){case"Celulares":a="sap-icon://iphone";break;case"Préstamo":a="sap-icon://loan";break;case"Motos":a="images/motorbike.png";break;case"Bicicleta":a="images/e_bike.png";break;case"iPhone":a="images/iphone.png";break;case"Accesorio":a="sap-icon://headset";break}return a},formatStyle:function(e){var a="";switch(e){case"Celulares":a="valueCelulares";break;case"Préstamo":a="valuePrestamos";break}return a},formatProducto:function(e){var a="";switch(e){case"Bicicleta":a=e+"s";break;case"Préstamo":a=e+"s";break;case"Accesorio":a=e+"s";break;default:a=e}return a}})});
},
	"geosales/geosales/i18n/i18n.properties":'# This is the resource bundle for geosales.geosales\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Monitor de Ventas\n\n#YDES: Application description\nappDescription=Monitoreo de ventas en tiempo real\r\n#XTIT: Main view title\ntitle=Monitor de Ventas',
	"geosales/geosales/manifest.json":'{"_version":"1.17.0","sap.app":{"id":"geosales.geosales","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.11.2","toolsId":"7c402a9a-17c4-4386-9f29-a86588046afa"},"dataSources":{"mainService":{"uri":"/sap/opu/odata/sap/ZCDS_VENTAS_DASHBOARD_CDS/","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"2.0"}},"Regiones":{"uri":"./data/states.json","type":"JSON"}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"dependencies":{"minUI5Version":"1.112.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{},"sap.ui.vbm":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"geosales.geosales.i18n.i18n","fallbackLocale":"","supportedLocales":[""]}},"":{"dataSource":"mainService","preload":true,"settings":{}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"geosales.geosales.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteDashboard","pattern":":?query:","target":["TargetDashboard"]}],"targets":{"TargetDashboard":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Dashboard","viewName":"Dashboard"}}},"rootView":{"viewName":"geosales.geosales.view.App","type":"XML","async":true,"id":"App"},"config":{"sample":{"stretch":true,"files":["states.json","mexicostatesCoordinates.json","images/perrocara.ico","images/vendiendo.png","e_bike.png","motorbike.png","iphone.png","Arboard3.png"]}}}}',
	"geosales/geosales/model/models.js":function(){
sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"geosales/geosales/view/App.view.xml":'<mvc:View controllerName="geosales.geosales.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"></App></mvc:View>\n',
	"geosales/geosales/view/Dashboard.view.xml":'<mvc:View xmlns:cssgrid="sap.ui.layout.cssgrid" xmlns:core="sap.ui.core" xmlns:f="sap.f" controllerName="geosales.geosales.controller.Dashboard"\n    xmlns:mvc="sap.ui.core.mvc" \n    displayBlock="true"\n    xmlns="sap.m"\n    xmlns:vbm="sap.ui.vbm"\n    xmlns:w="sap.ui.integration.widgets"\n    xmlns:card="sap.f.cards"\n    xmlns:l="sap.ui.layout"\n    xmlns:viz="sap.viz.ui5.controls"\n    xmlns:viz.data="sap.viz.ui5.data"\n    xmlns:viz.feeds="sap.viz.ui5.controls.common.feeds"\n    xmlns:c="sap.suite.ui.commons"\n    xmlns:chart="sap.suite.ui.microchart"><Page id="page" showHeader="false"><ScrollContainer\n\t\theight="100%"\n\t\twidth="100%"\n\t\tvertical="true"\n        horizontal="false"><VBox class="sapUiSmallMargin" width="100%" ><HBox width="100%" justifyContent="SpaceBetween" alignItems="Center"><Image src="images/Artboard3.png" width="10rem"/><Text  text="{\n                    path : \'/date\',\n                    type : \'sap.ui.model.type.Date\',\n                    formatOptions: {\n                        style : \'long\'\n                    }\n                }" class="myDate"/><Text id="Time" text="" class="myDate sapUiMediumMarginEnd"/></HBox><f:GridContainer id="totalesBinding" visible="true" items="{data>/results}" ><f:items><GenericTile frameType="TwoByHalf" mode="ContentMode" ><layoutData><f:GridContainerItemLayoutData minRows="1" columns="4" /></layoutData><TileContent class="headerHalf"><content><HBox class="sapUiTinyMarginBegin" justifyContent="SpaceBetween" alignItems="Center" ><Avatar src="{parts: [{ path: \'data>Producto\' }], formatter: \'.formatIcon\'}" \n                                                displaySize="M" displayShape="Square" backgroundColor="Transparent" /><VBox ><Title text="{parts: [{ path: \'data>Producto\' }], formatter: \'.formatProducto\'}" textAlign="Center" class="myTitle"/><Text text="{data>tipo_venta}" class="mySubTitle"/></VBox><VBox justifyContent="Center" alignItems="Center"><Title text="{data>total}" class="myNumber"/></VBox></HBox></content></TileContent></GenericTile></f:items></f:GridContainer><f:GridContainer width="100%" class="sapUiSmallMarginTop sapUiSmallMarginBottom"><f:Card id="cardMap" width="100%" height="100%" ><f:layoutData><f:GridContainerItemLayoutData minRows="6" columns="8" /></f:layoutData><f:content><l:FixFlex ><l:fixContent ><vbm:AnalyticMap id="vbi" centerPosition="0;0" width="100%"                 \n                                initialPosition="-101;24;0" initialZoom="5" disableZoom="true" disablePan="true"\n                                regionClick="onRegionClick" regionContextMenu="onRegionContextMenu"><vbm:regions><vbm:Region code="{code}" color="{color}"  tooltip="{country}"/></vbm:regions><vbm:legend><vbm:Legend caption="Resumen de Ventas" ><vbm:items><vbm:LegendItem id="legend01" text=""  color="#1b7eac"></vbm:LegendItem><vbm:LegendItem id="legend02" text=""  color="#F1B434"></vbm:LegendItem></vbm:items></vbm:Legend></vbm:legend><vbm:vos ><vbm:Spots ></vbm:Spots></vbm:vos></vbm:AnalyticMap></l:fixContent></l:FixFlex></f:content></f:Card><VBox visible="true" class="flex1" fitContainer="true"><layoutData><f:GridContainerItemLayoutData minRows="4" columns="2" /></layoutData><f:Card id="sinVentasTile"  visible="false" ><f:content><VBox alignItems="Center"   justifyContent="Center"><Title text="Esperando ventas" textAlign="Center" class="myHeadText sapUiSmallMargin"/><Avatar src="images/vendiendo.png" displaySize="XL" displayShape="Square" class="sapUiTinyMarginTopBottom"/><Text text="No hay ventas recientes" class="sapUiSmallMargin" textAlign="Center" /></VBox></f:content></f:Card><VBox id="listRecientes" visible="true" width="100%" fitContainer="true"></VBox></VBox><VBox width="100%" ><layoutData><f:GridContainerItemLayoutData minRows="2" columns="4" /></layoutData><f:Card class="cardTotales"><f:layoutData><f:GridContainerItemLayoutData minRows="2" columns="4" /></f:layoutData><f:header><card:Header  title="Total de ventas" subtitle="Comparativa contra el mismo día del año anterior" /></f:header><f:content><HBox><chart:HarveyBallMicroChart id="ballChart1" size="L"  totalScale="" class="sapUiLargeMarginTopBottom sapUiSmallMarginBegin "><chart:HarveyBallMicroChartItem id="ballChart2" color="Good" fractionScale=""/></chart:HarveyBallMicroChart><VBox class="sapUiSmallMarginTop"><HBox alignItems="Center"   justifyContent="Center" class="sapUiLargeMarginTop"><core:Icon src="sap-icon://color-fill" color="#3fa45b" /><Text id="fechaBall1" class="sapUiSmallMarginBegin" /></HBox><HBox alignItems="Center" justifyContent="Center" class="sapUiSmallMarginTop"><core:Icon src="sap-icon://color-fill" /><Text id="fechaBall2" class="sapUiSmallMarginBegin" /></HBox></VBox></HBox></f:content></f:Card><f:Card class="sapUiSmallMarginTop cardTotales"><f:layoutData><f:GridContainerItemLayoutData minRows="2" columns="4" /></f:layoutData><f:header><card:Header title="Estados Top en ventas" /></f:header><f:content><VBox class="sapUiSmallMargin"><chart:InteractiveBarChart id="topEstados" displayedBars="5"><chart:bars></chart:bars></chart:InteractiveBarChart></VBox></f:content></f:Card></VBox><f:Card id="cardMeses" width="100%" height="100%" ><f:layoutData><f:GridContainerItemLayoutData minRows="6" columns="5" /></f:layoutData><f:content><viz:VizFrame id="idVizFrame" uiConfig="{applicationSet:\'fiori\'}" height=\'100%\' width="100%" vizType=\'stacked_bar\' vizProperties="{ \n                            plotArea: {\n                                dataLabel: {                                                                                                                \n                                    visible: true,\n                                    formatString: \'__UI5__PercentageMaxFraction2\'\n                                }                                \n                            },\n                            valueAxis: {\n                                title:{\n                                    visible: false\n                                }\n                            },\n                            categoryAxis: {\n                                title: {\n                                    visible: false\n                                }\n                            },\n                            title: {\n                                visible: true,\n                                text: \'Ventas año actual vs. anterior\'\n                            }\n                           \n                          }"\n                          ><viz:dataset ><viz.data:FlattenedDataset data="{myModel>/results}" ><viz.data:dimensions><viz.data:DimensionDefinition name="Nombre_Mes" value="{Nombre_Mes}" /><viz.data:DimensionDefinition name="Anio" value="{Anio}"/></viz.data:dimensions><viz.data:measures><viz.data:MeasureDefinition name="Ventas" value="{Ventas}"/></viz.data:measures></viz.data:FlattenedDataset></viz:dataset><viz:feeds><viz.feeds:FeedItem uid="valueAxis"    type="Measure"   values="Ventas" /><viz.feeds:FeedItem uid="categoryAxis" type="Dimension" values="Nombre_Mes" /><viz.feeds:FeedItem uid="color" type="Dimension" values="Anio" /></viz:feeds></viz:VizFrame></f:content></f:Card></f:GridContainer></VBox></ScrollContainer></Page></mvc:View>\n',
	"geosales/geosales/view/SlideTiles.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.f" displayBlock="true"><SlideTile ><GenericTile headerImage="sap-icon://bus-public-transport"\r\n                   id="Financiamiento"            \r\n                   header=""\r\n                   subheader="Financiamiento"\r\n\t\t        \t\t   frameType="TwoByOne" \r\n                   class="sapUiTinyMarginTop sapUiTinyMarginBegin"><TileContent footer="Abril 18, 2024" frameType="TwoByOne"><FeedContent contentText="" subheader="" value="132" class="valueMotos"/></TileContent></GenericTile><GenericTile headerImage="sap-icon://bus-public-transport"                \r\n                     header=""\r\n                     subheader="Contado"\r\n\t\t\t        \t     frameType="TwoByOne" \r\n                     class="sapUiTinyMarginTop sapUiTinyMarginBegin"><TileContent footer="Abril 18, 2024" frameType="TwoByOne"><FeedContent contentText="" subheader="" value="132" class="valueMotos"/></TileContent></GenericTile></SlideTile></core:FragmentDefinition>'
});
//# sourceMappingURL=Component-preload.js.map
