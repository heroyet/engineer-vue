<template>
  <div id="map2" style="height: 1080px;width: 1920px;"></div>
</template>
<script>
  import "@/components/mineMap/css/ringPoint.css"
  import {mineMapService} from './mineMapServiceConfig'
  import remoteLoad from "./remoteLoad";
  // import remoteLoad from "@/module/mineMap/remoteLoad"
  var baseMap;
  var markers = {};
  var diffuseMarkers = [];
  //打点样式z-index(一般pointIndex>ringPointIndex)
  var pointIndex = 10;
  //点扩散样式z-index;
  var ringPointIndex = 5;
  var popups = [];
  var infoPage1,infoPage2,infoPage3,infoPage4=null;
  export default {
    name: "baseMap",
    data() {
      return {
        apiMap: null,
        //地图初始化完成标志
        mapLoaded: false,
      }
    },
    //在模板渲染成html后调用
    mounted() {
      // this.initMineMap();
    },
    //在模板渲染成html前调用
    created() {
      // 载入地图和UI组件
      Promise.all([
        remoteLoad(mineMapService.baseLayerJs),
        remoteLoad(mineMapService.templateJs),
        remoteLoad(mineMapService.miniemapEditJs),
        remoteLoad(mineMapService.minemapUtilJs),
      ]).then(() => {
        this.initMineMap()
      })
    },
    methods: {
      //初始化地图
      initMineMap() {
        let apiMap = this.apiMap = window.minemap;
        let $this = this;
        /**
         * 全局参数设置
         */
        apiMap.domainUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].domainUrl;
        apiMap.dataDomainUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].dataDomainUrl;
        apiMap.spriteUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].spriteUrl;
        apiMap.serviceUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].serviceUrl;
        /**
         * appKey、solution设置
         */
        apiMap.appKey = mineMapService['baseLayer_' + process.env.NODE_ENV].appKey;
        apiMap.solution = mineMapService['baseLayer_' + process.env.NODE_ENV].solution;
        /**
         * 初始化地图实例
         */
        baseMap = this.baseMap = new apiMap.Map({
          container: 'map2',
          style: mineMapService['baseLayer_' + process.env.NODE_ENV].mineMapStyle, /*底图样式*/
          center: [117.019396,25.061646], /*龙岩地图中心点*/
          // center: [119.776110,25.505156], /*平潭地图中心点*/
          zoom: 11, /*地图默认缩放等级*/
          pitch: 0, /*地图俯仰角度*/
          maxZoom: 17, /*地图最大缩放等级*/
          minZoom: 10  /*地图最小缩放等级*/
        });
        baseMap.on('load', function () {
          //保证地图初始化完成后再进行地图的相关数据初始化操作
          var _setInterval = setInterval(function () {
            if (baseMap && baseMap.isStyleLoaded()) {
              //加载成功后业务处理
              clearInterval(_setInterval);
              console.log("地图加载完成！");
              // $this.initMap();
            }
          }, 200);
        })

      },
      //添加图片源(通过此方法添加的图片源需放在../mineMap/images目录下)
      addImageIcon(imgName,imgSourceName){
        baseMap.loadImage(require("./images/"+imgName), function(error, image) {
          if (error) throw error;
          if (!baseMap.hasImage(imgSourceName)){
            baseMap.addImage(imgSourceName, image);
          }
        });
      },
      //添加图层
      addLayer(layerId,layerType,dataSourceName,imageName){
        baseMap.addLayer({
          "id": layerId,
          "type": layerType,
          "source": dataSourceName,
          "filter": ["!has", "point_count"],
          "layout": {
            "icon-image": imageName,
            "icon-size": 1
          }
        });
      },
      //添加面图层
      addFillLayer(layerId,sourceName,color) {
        if(baseMap.getLayer(layerId)){
          return
        }
        baseMap.addLayer({
          "id": layerId,
          "type": "fill",
          "source": sourceName,
          "layout": {
            "visibility": "visible",
          },
          "paint": {
            "fill-color": color,
            "fill-opacity": 0.5,
            "fill-outline-color": "#fa0f0c",
          },
          "minzoom": 7,
          "maxzoom": 13
        });
      },
      //添加图片文字图层
      addTextImgLayer(layerId,dataSourceName) {
        if(baseMap.getLayer(layerId)){
          return;
        }
        baseMap.addLayer({
          "id": layerId,
          "type": "symbol",
          "source": dataSourceName,
          "layout": {
            "visibility": "visible",
            "text-field": "{title}",
            "text-offset": [0, 1],
            "text-anchor": "top",
            "text-size": 35,
            "icon-allow-overlap": true,  //图标允许压盖
            "text-allow-overlap": true,   //图标覆盖文字允许压盖
          },
          "paint": {
            "text-color": '#fff',
            "text-halo-color": "#fff",
            "text-halo-width": 0.1,
          },
          "minzoom": 7,
          "maxzoom": 13
        });
      },
      //删除图层
      removeLayer(layerId){
        if (baseMap) {
          if (baseMap.getLayer(layerId)) {
            baseMap.removeLayer(layerId);
          }else{
            // alert(layerId+"图层不存在");
          }
        }else{
          // alert("地图未初始化或已经销毁！");
        }
      },
      //通过请求地址添加数据源
      addDataSourceByUrl(dataSourceName,dataSourceUrl){
        baseMap.addSource(dataSourceName, {
          type: "geojson",
          data: dataSourceUrl,
          cluster: true,
          clusterMaxZoom: 15, /* 最大聚合层级 */
          clusterRadius: 200, /* 聚合半径 */
        });
      },
      //通过数据添加数据源 flag是否清除原数据源
      addDataSourceByData(dataSourceName,data,flag){
        if (baseMap.getSource(dataSourceName)) {
          if(flag){
            baseMap.removeSource(dataSourceName);
          }else{
            return
          }
        }
        baseMap.addSource(dataSourceName, {
          type: 'geojson',
          data: data
        });
      },
      //清除数据源
      removeDataSource(dataSourceName){
        if (baseMap.getSource(dataSourceName)) {
          baseMap.removeSource(dataSourceName);
        }
      },
      //移除聚合图层
      removeAggregationLayer(layerId){
        //移除非聚合图层
        if(baseMap.getLayer(layerId)){
          baseMap.removeLayer(layerId);
        }
        //移除聚合图层（三层）
        if(baseMap.getLayer(layerId+"-0")){
          baseMap.removeLayer(layerId+"-0");
        }
        if(baseMap.getLayer(layerId+"-1")){
          baseMap.removeLayer(layerId+"-1");
        }
        if(baseMap.getLayer(layerId+"-2")){
          baseMap.removeLayer(layerId+"-2");
        }
        //移除数字图层
        if(baseMap.getLayer(layerId+"-count")){
          baseMap.removeLayer(layerId+"-count");
        }
      },
      //添加聚合图层
      addAggregationLayer(dataSourceName,dataUrl,imageName,layerId){
        //聚合图层数据
        this.addDataSourceByUrl(dataSourceName,dataUrl);
        //添加非聚合图层
        this.addLayer(layerId,"symbol",dataSourceName,imageName);
        // 添加聚合图层
        var layers = [
          [1000, 'rgba(241, 128, 23, 0.6)'],
          [100, 'rgba(240, 194, 12, 0.6)'],
          [0, 'rgba(110, 204, 57, 0.6)']
        ];
        layers.forEach(function (layer, i) {
          baseMap.addLayer({
            "id": layerId + "-" + i,
            "type": "circle",
            "source": dataSourceName,
            "paint": {
              "circle-color": layer[1],
              "circle-radius": 90
            },
            "filter": i === 0 ?
              [">=", "point_count", layer[0]] :
              ["all", [">=", "point_count", layer[0]], ["<", "point_count", layers[i - 1][0]]]
          });
        });
        // 添加数量图层
        baseMap.addLayer({
          "id": layerId+"-count",
          "type": "symbol",
          "source": dataSourceName,
          "layout": {
            "text-field": "{point_count}",
            "text-size": 50
          },
          "paint": {
            "text-color": "rgba(245,245,245,.75)"
          },
          "filter": ["has", "point_count"]
        });
      },
      //地图平移
      mapMove(gisx,gisy){
        if(gisx && gisy){
          baseMap.panTo([gisx,gisy]);
        }
      },
      //地图飞行
      mapFly(gisX,gisY,zoom,duration){
        var centerCood = [119.776110,25.505156];
        if(gisX && gisY){
          centerCood = [gisX,gisY];
        }
        if(!duration){
          //飞行时间，默认2秒
          duration = 2000;
        }
        if(!zoom){
          //默认地图等级11
          zoom = 11;
        }
        baseMap.easeTo({
          //飞行中心点
          center: centerCood,
          zoom: zoom,
          bearing: 0,
          pitch: 0,
          duration: duration
        });
      },
      //地图打点(该接口图片源放在public/mapimages/目录下)
      addPoint(pointJson,type){
        let $this = this;
        if($this.popup2){
          $this.popup2.remove();
          $this.popup2 = null;
        }
        // 自定义点标记的内部DOM元素
        var el = document.createElement('div');
        el.id = pointJson.pointId;
        // 自定义DOM样式 或者通过css类设置
        el.style["background-image"] = 'url('+ pointJson.imgUrl +')';
        el.style["background-size"] = "cover";
        el.style.width = pointJson.imgSize + "px";
        el.style.height = pointJson.imgSize + "px";
        // el.style.zIndex = pointIndex;
        el.className = "eui-lwjc-bubble";
        // el.style["border-radius"] = "50%";
        // Marker构造函数接收两个参数，一个为自定义的DOM元素，一个是Object参数，其中包括偏移量等
        // offset参数为标注点相对于其左上角偏移像素大小
        // 调用setLngLat方法指定Marker的坐标位置
        if(pointJson.eventType && pointJson.method){
          //mousemove 移动
          el.addEventListener(pointJson.eventType, pointJson.method);//mousemove
        }
        if(pointJson.popupMethod){
          //移入
          el.addEventListener("mouseenter", pointJson.popupMethod);
          //移出
          el.addEventListener("mouseleave", function () {
            if($this.popup2){
              $this.popup2.remove();
              $this.popup2 = null;
            }
          });//mousemove
        }
        var popup = "";
        if(pointJson.popupHtml){
          popup = new window.minemap.Popup({offset: [0, -pointJson.imgSize*0.66]})
            .setHTML('<span>fffff</span>');
        }
        var _marker = new window.minemap.Marker(el, {
          offset: [0, 0], // 左右，上下
          anchor: 'bottom',//锚点
          rotation: 0, // marker的旋转角度，以锚点作为旋转中心点，顺时针为正
          pitchAlignment: 'map', // 倾斜对齐参数(默认值是‘auto’)，此值决定marker标记是贴在地图平面上，还是立在地图平面上，当值为`map`时，marker标记贴在地图平面上，当值为`viewport`时，marker标记立在地图平面上，当值为 `auto`时，会根据 `rotationAlignment`参数的值，自动决定.
          rotationAlignment: 'map' // 旋转对齐参数(默认值是‘auto’)，此值决定地图在旋转的时候，marker标记是否跟随旋转，当值为`map` 时，marker标记会固定在地图平面上，不会跟随地图的旋转而旋转；当值为`viewport`时，marker标记会跟随地图的旋转而旋转，保持正向面对观察者；当值为`auto`时，相当于值`viewport`.
        }).setLngLat([pointJson.gisX,pointJson.gisY]).setPopup(popup).setZIndex(pointIndex).addTo(baseMap);
        //将打的点放入方便删除
        if(!markers[type]){
          markers[type] = [];
          markers[type].push(_marker);
        }else{
          markers[type].push(_marker);
        }
      },
      //清除打点
      removeAllPoint(type){
        if (baseMap && markers[type] && markers[type].length !== 0) {
          var markerList = markers[type];
          for (let i = 0; i < markerList.length; i++) {
            markerList[i].remove();
          }
        }
      },
      //添加路况图层
      addTrafficLayer(){
        this.updateTrafficSource()
        //如果底图没有配置路况图层，需要自己手动增加
        baseMap.addLayer({
          "id": "trafficlines",
          "type": "line",
          "source": "Traffic",
          "source-layer": "Trafficrtic",
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          "paint": {
            "line-color": {
              "property": "status",
              "stops": [
                [0, '#999999'],
                [1, '#66cc00'],
                [2, '#ff9900'],
                [3, '#cc0000'],
                [4, '#9d0404']
              ]
            },
            "line-width": {
              "stops": [[5, 1], [18, 3]], "base": 1.2
            }
          }
        });
      },
      //更新路况图层数据
      updateTrafficSource(){
        if (baseMap.getSource('Traffic')) {
          baseMap.removeSource('Traffic');
        }
        baseMap.addSource('Traffic', {
          "type": "vector",
          "traffic": true,
          "tiles": ["minemapdatad://Trafficrtic/{z}/{x}/{y}/" + new Date().getTime()]
        })
      },
      //轨迹图
      addTrackLayers(lineSourceName,lineSourceData,isTracking) {
        //重新绘制(清除轨迹图层时，repaint = false)
        baseMap.repaint = true;
        //添加轨迹数据源
        this.addDataSourceByData(lineSourceName,lineSourceData);
        //从轨迹数据中获取图标移动坐标数据
        var route = lineSourceData.geometry.coordinates;
        //转化图标移动数据
        var jsonData = window.Template.util.pointArrayToSymtrackingGeoJson(route, false);
        this.addDataSourceByData("tracking"+lineSourceName,jsonData);
        //添加轨迹图层
        baseMap.addLayer({
          "type": "line",
          "source": lineSourceName,
          "id": lineSourceName+"LayerId",
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          "paint": {
            "line-width": 3,
            "line-color": "#000"
          }
        });
        //添加图标移动图层
        if(isTracking){
          baseMap.addLayer({
            "type": "symtracking",
            "source": "tracking"+lineSourceName,
            "id": "tracking"+lineSourceName + "LayerId",
            "layout": {
              // "icon-image": "kk-icon",
              // "icon-image": "event-app-1002-18",
              "icon-image": "n-vehicle",
              "icon-allow-overlap": false,
              "icon-ignore-placement": true,
              "symbol-avoid-edges": false,
              "symbol-placement": "line",
              "symtracking-fps": 37,            //行动快慢，现在是1秒37帧
              // "symtracking-time-segment": 10,   //总共要运行多少秒
              "compatible-mode": false          //notice  采用新的数据样式，保证小车不消失
            },
            "paint": {
              "icon-color": "#ff0000",
              "symtracking-delay": 0            //notice 小车更新延迟为零，保证小车能够循环播放，小车循环播放的条件是：此项为零 并且 symtracking-fps * symtracking-time-segment ≈ myGeojson.features.length
            }
          });
        }
      },
      //清除轨迹图层
      removeTrackLayers(lineSourceName){
        baseMap.repaint = false;
        //清除轨迹图层
        if (baseMap.getLayer(lineSourceName+"LayerId")) {
          baseMap.removeLayer(lineSourceName+"LayerId");
        }
        //清除移动图层
        if (baseMap.getLayer("tracking"+lineSourceName + "LayerId")) {
          baseMap.removeLayer("tracking"+lineSourceName + "LayerId");
        }
      },
      //点扩散
      pointDiffuse(gisX,gixY){
        this.mapMove(gisX,gixY);
        var el = document.createElement('div');
        el.style.zIndex = ringPointIndex;
        var p = document.createElement('div');
        p.className = 'ring-point-marker';
        var p1 = document.createElement('div');
        p1.className = 'ring-point-inner1';
        var p2 = document.createElement('div');
        p2.className = 'ring-point-inner2';
        var p3 = document.createElement('div');
        p3.className = 'ring-point-inner3';
        p.appendChild(p1);
        p.appendChild(p2);
        p.appendChild(p3);
        el.appendChild(p);
        //添加marker
        var marker = new window.minemap.Marker(el, {offset: [-30, -55]}).setLngLat([gisX,gixY]).addTo(baseMap);
        diffuseMarkers.push(marker);
      },
      //清除点扩散
      removePointDiffuse(){
        if(diffuseMarkers.length !== 0 ){
          for(var i=0;i<diffuseMarkers.length;i++){
            diffuseMarkers[i].remove();
          }

        }
      },
      //
      mouseCallback(type,method){
        baseMap.on('mousemove','eui-lwjc-bubble', function(e) {
          console.log('A click 事件触发在点 ');
        });
      },
      /**
       * 判断点是否在面内
       * @param coord 点坐标
       * @param surface 面坐标集合
       */
      calculationResult(coord,coordinates){
        var isPointInPolygon = window.minemaputil.SpaceUtil.pointWithinPolygon(coord, coordinates);
        return isPointInPolygon;
      },
      //监听鼠标
      //添加信息窗体
      addInfoPage(lng,lat){
        if(infoPage1){
          infoPage1.remove()
          infoPage1 = null;
        }
        var html = "<div>" +
          "<span style='margin: 10px 10px'>警力：<span style='color: #5470c6'>50</span>人</span></br>" +
          "<span style='margin: 10px 10px'>警情：<span style='color: #5470c6'>40</span>起</span></div>";
        infoPage1 = new minemap.Popup({closeOnClick: false, closeButton: false, offset: [0, 0]})
          .setLngLat([119.740329, 25.460417])
          .setHTML(html)
          .addTo(baseMap);
      },
      addInfoPage22(lng,lat){
        if(infoPage2){
          infoPage2.remove()
          infoPage2 = null;
        }
        var html = "<div>" +
          "<span style='margin: 10px 10px'>警力：<span style='color: #5470c6'>45</span>人</span></br>" +
          "<span style='margin: 10px 10px'>警情：<span style='color: #5470c6'>15</span>起</span></div>";
        infoPage2 = new minemap.Popup({closeOnClick: false, closeButton: false, offset: [0, 0]})
          .setLngLat([119.802035, 25.497791])
          .setHTML(html)
          .addTo(baseMap);
      },
      addInfoPage3(lng,lat){
        if(infoPage3){
          infoPage3.remove()
          infoPage3 = null;
        }
        var html = "<div>" +
          "<span style='margin-left: 10px'>警力：<span style='color: #5470c6'>50</span>人</span></br>" +
          "<span style='margin-left: 10px'>警情：<span style='color: #5470c6'>34</span>起</span></div>";
        infoPage3 = new minemap.Popup({closeOnClick: false, closeButton: false, offset: [0, 0]})
          .setLngLat([119.780411, 25.553941])
          .setHTML(html)
          .addTo(baseMap);
      },
      addInfoPage4(lng,lat){
        if(infoPage4){
          infoPage4.remove()
          infoPage4 = null;
        }
        var html = "<div>" +
          "<span style='margin: 10px 10px'>警力：<span style='color: #5470c6'>30</span>人</span></br>" +
          "<span style='margin: 10px 10px'>警情：<span style='color: #5470c6'>18</span>起</span></div>";
        infoPage4 = new minemap.Popup({closeOnClick: false, closeButton: false, offset: [0, 0]})
          .setLngLat([119.71185, 25.63674])
          .setHTML(html)
          .addTo(baseMap);
      },
      removeInfoPage(){
        if(infoPage1){
          infoPage1.remove()
          infoPage1 = null;
        }
        if(infoPage2){
          infoPage2.remove()
          infoPage2 = null;
        }
        if(infoPage3){
          infoPage3.remove()
          infoPage3 = null;
        }
        if(infoPage4){
          infoPage4.remove()
          infoPage4 = null;
        }
      }
    }
  }
</script>

<style scoped>

</style>
