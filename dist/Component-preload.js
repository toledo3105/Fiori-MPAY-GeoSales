//@ui5-bundle geosales/geosales/Component-preload.js
sap.ui.require.preload({
	"geosales/geosales/Component.js":function(){
sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","geosales/geosales/model/models"],function(e,t,i){"use strict";return e.extend("geosales.geosales.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
},
	"geosales/geosales/controller/App.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("geosales.geosales.controller.App",{onInit(){}})});
},
	"geosales/geosales/controller/Dashboard.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/vbm/AnalyticMap","sap/ui/model/json/JSONModel","sap/ui/Device","sap/ui/core/Fragment","sap/ui/core/format/DateFormat","sap/ui/core/format/NumberFormat"],function(e,t,a,o,s,r,n){"use strict";t.GeoJSONURL="./map/Mexico.JSON";var i;var l={};var d="/sap/opu/odata/sap/ZCDS_VENTAS_DASHBOARD_CDS";var c="/sap/opu/odata/sap/ZCDS_TOPVENTASXREG_CDS";var u="/sap/opu/odata/sap/ZCDS_VENTASXMES_SPLIT_CDS";var v=new sap.ui.model.odata.v2.ODataModel(d,false);var p=new sap.ui.model.odata.v2.ODataModel(c,false);var m=new sap.ui.model.odata.v2.ODataModel(u,false);var f=r.getDateInstance({style:"medium",UTC:true});var b=n.getCurrencyInstance({decimalSeparator:".",groupingSeparator:","});function y(e,t){const a=new Date;let o=a.getDate();let s=a.getMonth()+1;let r=a.getFullYear();let n=a.getHours();let i=a.getMinutes();let l=i-1;var d=r+"-"+s+"-"+o+"T00:00:00";var c=r+"-"+s+"-"+o+"T00:00:00";var u="PT"+n+"H"+l+"M"+"00S";var p="PT"+n+"H"+i+"M"+"00S";var m="/ZCDS_VENTAS_DASHBOARD(p_date=datetime'"+d+"',p_date_h=datetime'"+c+"',p_time_l=time'"+u+"',p_time_h=time'"+p+"')/Set";var f=t;v.bCanonicalRequests=true;v.setUseBatch(false);v.read(m,{urlParameters:{$expand:f},success:function(t){C(t.results[0].to_Totales.results,e);I(t.results[0].to_TotalesEstado.results,e);var a=h(t.results[0].to_Recientes.results,e);T(a,e);_(e,t.results[0].to_ComparativoDays.results);D(e,[]);g(e)},error:function(e){}})}function C(e,t){var a=0;var o=e.length;var s=[];t.byId("totalesProductos").destroyItems();e.forEach(r=>{a++;var n="sap-icon://money-bills";var i="";var d="sapUiSmallMargin";switch(r.Producto){case"Celulares":n="sap-icon://iphone";i=i+" valueCelulares";break;case"Préstamo":n="sap-icon://loan";i=i+"valuePrestamos";r.Producto=r.Producto+"s";break;case"Motos":n="sap-icon://bus-public-transport";i=i+" valueMotos";break}var n;var c=e[0].Fecha;var u=new sap.m.GenericTile({header:r.Producto,subheader:r.tipo_venta,headerImage:n,frameType:"TwoByOne",tileContent:new sap.m.TileContent({footer:f.format(c),content:new sap.m.FeedContent({value:r.total})})});u.addStyleClass(i);if(o>4){if(r.Producto in lDic){lDic[r.Producto]=lDic[r.Producto].addTile(u)}else{lDic[r.Producto]=new sap.m.SlideTile;var v=new sap.f.GridContainerItemLayoutData;v.setColumns(4);v.setMinRows(2);lDic[r.Producto].setLayoutData(v);lDic[r.Producto]=lDic[r.Producto].addTile(u)}if(a==o){for(let e in lDic){t.byId("totalesProductos").addItem(lDic[e])}}}else{var p=new sap.m.SlideTile;var v=new sap.f.GridContainerItemLayoutData;v.setColumns(4);v.setMinRows(2);p.setLayoutData(v);p.addTile(u);if(!l["totalesTop"]){t.byId("totalesProductos").addItem(p);s.push(t.byId("totalesProductos").getItems()[a-1].getId())}else{t.byId("totalesProductos").getItems()[a-1].removeAllTiles();t.byId("totalesProductos").getItems()[a-1].addTile(u)}}})}function I(e,t){var a=[];e.forEach(e=>{t.byId("vbi").addRegion(new sap.ui.vbm.Region({tooltip:e.DescEstado,code:"MX-"+e.Estado,color:"#1b7eac"}));if(a.find(t=>t==e.Estado)){}else{a.push(e.Estado)}});t.byId("legend01").setText(a.length+" estados han registrado ventas el día de hoy")}function T(e,t){e.forEach(e=>{t.byId("vbi").addRegion(new sap.ui.vbm.Region({code:"MX-"+e,color:"#F1B434"}))});t.byId("legend02").setText(e.length+" estados registraron ventas en el último minuto")}function h(e,t){var a=1;var o=0;var s={};var r=[];var n=[];var i=[];var d=t.byId("sinVentasTile");t.byId("listRecientes").destroyItems();if(e.length>0){t.byId("listRecientes").setVisible(true);t.byId("sinVentasTile").setVisible(false);e.forEach(e=>{if(!i.find(t=>t.Estado==e.Estado&&t.Producto==e.Producto&&t.tipo_venta==e.tipo_venta)){i.push(e)}else{var t=i.findIndex(t=>t.Estado==e.Estado&&t.Producto==e.Producto&&t.tipo_venta==e.tipo_venta);i[t].total++}});var c=i.length;i.forEach(e=>{if(r.find(t=>t==e.Estado)){}else{r.push(e.Estado)}var n="";var i="";switch(e.Producto){case"Celulares":i="sap-icon://iphone";n=n+"valueCelularesNC";break;case"Préstamo":i="sap-icon://loan";n=n+"valuePrestamosNC";e.Producto=e.Producto+"s";break;case"Motos":i="sap-icon://bus-public-transport";n=n+"valueMotosNC";break}var d=new sap.m.NumericContent({icon:i,value:e.total,withMargin:false});d.addStyleClass(n);var u=new sap.m.GenericTile({header:e.Producto,subheader:e.tipo_venta,frameType:"OneByOne",tileContent:new sap.m.TileContent({footer:e.DescEstado,content:d})});o+=1;if(o<=3){s[a]=new sap.m.SlideTile;s[a].addTile(u);a++}else{if(a>3){a=1}s[a].addTile(u);a++}if(o==c){a=1;do{var v=new sap.f.Card;v.setContent(s[a]);v.addCustomData(new sap.m.BadgeCustomData({value:"Nueva venta"}));if(v.getContent()){v.addStyleClass("sapUiSmallMarginBottom");if(!l["recentCards"]){t.byId("listRecientes").addItem(v)}else{t.byId("listRecientes").getItems()[a-1].destroyContent();t.byId("listRecientes").getItems()[a-1].setContent(s[a])}}a++}while(a<=3)}});if(!l["rexcentCards"]){}}else{t.byId("listRecientes").setVisible(false);t.byId("sinVentasTile").setVisible(true)}return r}function D(e,t){const a=new Date;let o=a.getDate();let s=a.getMonth()+1;let r=a.getFullYear();var n="2023-05-10T00:00:00";var i="/ZCDS_TOPVENTASXREG(p_fecha=datetime'"+n+"')/Set";p.bCanonicalRequests=true;p.setUseBatch(false);p.read(i,{success:function(t){e.byId("topEstados").destroyBars();t.results.forEach(t=>{e.byId("topEstados").addBar(new sap.suite.ui.microchart.InteractiveBarChartBar({label:t.bezei,value:parseFloat(t.registros)}))})},error:function(e){}})}function _(e,t){e.byId("ballChart1").setTotal(t[0].venta_anio_anterior);e.byId("ballChart2").setFraction(t[0].venta_Actual);e.byId("fechaBall1").setText(f.format(t[0].fecha));e.byId("fechaBall2").setText(f.format(t[0].fecha_Anterior))}function g(e){const t=new Date;let o=t.getFullYear();var s="/ZCDS_VENTASXMES_SPLIT(p_anio='"+o+"')/Set";m.bCanonicalRequests=true;m.setUseBatch(false);m.read(s,{urlParameters:{$orderby:"Anio,Mes asc"},success:function(t){var o=new a(t);e.byId("idVizFrame").setModel(o,"myModel")},error:function(e){}})}return e.extend("geosales.geosales.controller.Dashboard",{onInit:function(){i=this;y(i,"to_Totales,to_Recientes,to_TotalesEstado,to_ComparativoDays")},onBeforeRendering:function(){setInterval(function(){y(i,"to_Totales,to_Recientes,to_TotalesEstado,to_ComparativoDays")},6e4)}})});
},
	"geosales/geosales/i18n/i18n.properties":'# This is the resource bundle for geosales.geosales\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Monitor de Ventas\n\n#YDES: Application description\nappDescription=Monitoreo de ventas en tiempo real\r\n#XTIT: Main view title\ntitle=Monitor de Ventas',
	"geosales/geosales/manifest.json":'{"_version":"1.17.0","sap.app":{"id":"geosales.geosales","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:basic","version":"1.11.2","toolsId":"7c402a9a-17c4-4386-9f29-a86588046afa"},"dataSources":{"mainService":{"uri":"/sap/opu/odata/sap/ZCDS_VENTAS_DASHBOARD_CDS/","type":"OData","settings":{"annotations":[],"localUri":"localService/metadata.xml","odataVersion":"2.0"}},"Regiones":{"uri":"./data/states.json","type":"JSON"}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"dependencies":{"minUI5Version":"1.112.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.f":{},"sap.suite.ui.generic.template":{},"sap.ui.comp":{},"sap.ui.generic.app":{},"sap.ui.table":{},"sap.ushell":{},"sap.ui.vbm":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"geosales.geosales.i18n.i18n","fallbackLocale":"","supportedLocales":[""]}},"":{"dataSource":"mainService","preload":true,"settings":{}}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"geosales.geosales.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteDashboard","pattern":":?query:","target":["TargetDashboard"]}],"targets":{"TargetDashboard":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Dashboard","viewName":"Dashboard"}}},"rootView":{"viewName":"geosales.geosales.view.App","type":"XML","async":true,"id":"App"},"config":{"sample":{"stretch":true,"files":["states.json","mexicostatesCoordinates.json","images/perrocara.ico","images/vendiendo.png"]}}}}',
	"geosales/geosales/model/models.js":function(){
sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,n){"use strict";return{createDeviceModel:function(){var i=new e(n);i.setDefaultBindingMode("OneWay");return i}}});
},
	"geosales/geosales/view/App.view.xml":'<mvc:View controllerName="geosales.geosales.controller.App"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n    xmlns="sap.m"><App id="app"></App></mvc:View>\n',
	"geosales/geosales/view/Dashboard.view.xml":'<mvc:View xmlns:cssgrid="sap.ui.layout.cssgrid" xmlns:core="sap.ui.core" xmlns:f="sap.f" controllerName="geosales.geosales.controller.Dashboard"\n    xmlns:mvc="sap.ui.core.mvc" \n    displayBlock="true"\n    xmlns="sap.m"\n    xmlns:vbm="sap.ui.vbm"\n    xmlns:w="sap.ui.integration.widgets"\n    xmlns:card="sap.f.cards"\n    xmlns:l="sap.ui.layout"\n    xmlns:viz="sap.viz.ui5.controls"\n    xmlns:viz.data="sap.viz.ui5.data"\n    xmlns:viz.feeds="sap.viz.ui5.controls.common.feeds"\n    xmlns:chart="sap.suite.ui.microchart"><Page id="page" showHeader="false"><ScrollContainer\n\t\theight="100%"\n\t\twidth="100%"\n\t\tvertical="true"><VBox class="sapUiSmallMargin" width="100%" ><f:GridContainer  id="totalesProductos" width="100%"></f:GridContainer><f:GridContainer width="100%" class="sapUiSmallMarginTop sapUiSmallMarginBottom"><f:Card id="cardMap" width="100%" height="100%" ><f:layoutData><f:GridContainerItemLayoutData minRows="6" columns="8" /></f:layoutData><f:content><l:FixFlex ><l:fixContent ><vbm:AnalyticMap id="vbi" centerPosition="0;0" width="100%"                 \n                                initialPosition="-101;24;0" initialZoom="5" disableZoom="true" disablePan="true"\n                                regionClick="onRegionClick" regionContextMenu="onRegionContextMenu"><vbm:regions><vbm:Region code="{code}" color="{color}"  tooltip="{country}"/></vbm:regions><vbm:legend><vbm:Legend caption="Resumen de Ventas" ><vbm:items><vbm:LegendItem id="legend01" text=""  color="#1b7eac"></vbm:LegendItem><vbm:LegendItem id="legend02" text=""  color="#F1B434"></vbm:LegendItem></vbm:items></vbm:Legend></vbm:legend><vbm:vos ><vbm:Spots ></vbm:Spots></vbm:vos></vbm:AnalyticMap></l:fixContent></l:FixFlex></f:content></f:Card><VBox visible="true"><layoutData><f:GridContainerItemLayoutData minRows="2" columns="2" /></layoutData><f:Card id="sinVentasTile"  visible="false"><f:content><GenericTile header="Sin ventas" subheader="Tiendas trabajando" ><TileContent footer=""><HBox alignItems="Center"   justifyContent="Center"><Avatar src="images/vendiendo.png" displaySize="XL" displayShape="Square"/></HBox></TileContent></GenericTile></f:content></f:Card><VBox id="listRecientes" visible="true" width="100%" displayInline="true"></VBox></VBox><VBox width="100%" ><layoutData><f:GridContainerItemLayoutData minRows="2" columns="4" /></layoutData><f:Card class="cardTotales"><f:layoutData><f:GridContainerItemLayoutData minRows="2" columns="4" /></f:layoutData><f:header><card:Header  title="Total de ventas" subtitle="Comparativa contra el mismo día del año anterior" /></f:header><f:content><HBox><chart:HarveyBallMicroChart id="ballChart1" size="L"  totalScale="" class="sapUiLargeMarginTopBottom sapUiSmallMarginBegin "><chart:HarveyBallMicroChartItem id="ballChart2" color="Good" fractionScale=""/></chart:HarveyBallMicroChart><VBox class="sapUiSmallMarginTop"><HBox alignItems="Center"   justifyContent="Center" class="sapUiLargeMarginTop"><core:Icon src="sap-icon://color-fill" color="#3fa45b" /><Text id="fechaBall1" class="sapUiSmallMarginBegin" /></HBox><HBox alignItems="Center" justifyContent="Center" class="sapUiSmallMarginTop"><core:Icon src="sap-icon://color-fill" /><Text id="fechaBall2" class="sapUiSmallMarginBegin" /></HBox></VBox></HBox></f:content></f:Card><f:Card class="sapUiSmallMarginTop cardTotales"><f:layoutData><f:GridContainerItemLayoutData minRows="2" columns="4" /></f:layoutData><f:header><card:Header title="Estados Top en ventas" /></f:header><f:content><VBox class="sapUiSmallMargin"><chart:InteractiveBarChart id="topEstados" displayedBars="5"><chart:bars></chart:bars></chart:InteractiveBarChart></VBox></f:content></f:Card></VBox><f:Card id="cardMeses" width="100%" height="100%" ><f:layoutData><f:GridContainerItemLayoutData minRows="6" columns="5" /></f:layoutData><f:content><viz:VizFrame id="idVizFrame" uiConfig="{applicationSet:\'fiori\'}" height=\'100%\' width="100%" vizType=\'stacked_bar\' vizProperties="{ \n                            plotArea: {\n                                dataLabel: {                                                                                                                \n                                    visible: true\n                                }                                \n                            },\n                            valueAxis: {\n                                title:{\n                                    visible: false\n                                }\n                            },\n                            categoryAxis: {\n                                title: {\n                                    visible: false\n                                }\n                            },\n                            title: {\n                                visible: true,\n                                text: \'Ventas año actual vs. anterior\'\n                            }\n                           \n                          }"\n                          ><viz:dataset ><viz.data:FlattenedDataset data="{myModel>/results}" ><viz.data:dimensions><viz.data:DimensionDefinition name="Nombre_Mes" value="{Nombre_Mes}" /><viz.data:DimensionDefinition name="Anio" value="{Anio}"/></viz.data:dimensions><viz.data:measures><viz.data:MeasureDefinition name="Ventas" value="{Ventas}"/></viz.data:measures></viz.data:FlattenedDataset></viz:dataset><viz:feeds><viz.feeds:FeedItem uid="valueAxis"    type="Measure"   values="Ventas" /><viz.feeds:FeedItem uid="categoryAxis" type="Dimension" values="Nombre_Mes" /><viz.feeds:FeedItem uid="color" type="Dimension" values="Anio" /></viz:feeds></viz:VizFrame></f:content></f:Card></f:GridContainer></VBox></ScrollContainer></Page></mvc:View>\n',
	"geosales/geosales/view/SlideTiles.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:f="sap.f" displayBlock="true"><SlideTile ><GenericTile headerImage="sap-icon://bus-public-transport"\r\n                   id="Financiamiento"            \r\n                   header=""\r\n                   subheader="Financiamiento"\r\n\t\t        \t\t   frameType="TwoByOne" \r\n                   class="sapUiTinyMarginTop sapUiTinyMarginBegin"><TileContent footer="Abril 18, 2024" frameType="TwoByOne"><FeedContent contentText="" subheader="" value="132" class="valueMotos"/></TileContent></GenericTile><GenericTile headerImage="sap-icon://bus-public-transport"                \r\n                     header=""\r\n                     subheader="Contado"\r\n\t\t\t        \t     frameType="TwoByOne" \r\n                     class="sapUiTinyMarginTop sapUiTinyMarginBegin"><TileContent footer="Abril 18, 2024" frameType="TwoByOne"><FeedContent contentText="" subheader="" value="132" class="valueMotos"/></TileContent></GenericTile></SlideTile></core:FragmentDefinition>'
});
//# sourceMappingURL=Component-preload.js.map
