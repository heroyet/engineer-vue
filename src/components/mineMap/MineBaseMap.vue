<!--
 * @Author: your name
 * @Date: 2021-05-19 16:37:13
 * @LastEditTime: 2021-06-11 17:47:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tocc-portal-web\src\module\mineMap\MineBaseMap.vue
-->
<template>
  <div id="map" style="width: 1366px; height: 500px"></div>
</template>
<script>
import loadMineMapJs from '@/components/mineMap/js/loadResources'
import { mineMapService } from '@/components/mineMap/mineMapServiceConfig'
import staticMethods from '@/components/mineMap/js/staticMethods'
import '@/components/mineMap/css/ringPoint.css'
import remoteLoad from './remoteLoad'
import './js/template.js'
// 冒泡z-index
var popupIndex = 5
let loadedMineMapJsCss = false
var hoveredStateId = null
var saveLayerId = null
var saveSourceName = null
//点扩散
var diffuseMarkers = []
//打点样式z-index(一般pointIndex>ringPointIndex)
var defaultPointIndex = 1
//点扩散样式z-index;
var ringPointIndex = 0
// 迁徙图层
var echartslayer
export default {
  name: 'MineBaseMap',
  created() {
    //在模板渲染成html前调用
    if (!loadedMineMapJsCss) {
      loadMineMapJs().then(() => {
        loadedMineMapJsCss = true
      })
    }
  },
  methods: {
    // 初始化地图
    initMap(longitude, latitude, zoom, solutionId, pitch) {
      var solution = mineMapService['baseLayer_' + process.env.NODE_ENV].solution
      var style = mineMapService['baseLayer_' + process.env.NODE_ENV].mineMapStyle
      if (solutionId && solutionId === 2) {
        solution = mineMapService['baseLayer_' + process.env.NODE_ENV].solution2
        style = mineMapService['baseLayer_' + process.env.NODE_ENV].mineMapStyle2
      }
      if (solutionId && solutionId === 3) {
        solution = mineMapService['baseLayer_' + process.env.NODE_ENV].solution3
        style = mineMapService['baseLayer_' + process.env.NODE_ENV].mineMapStyle3
      }
      minemap.domainUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].domainUrl
      minemap.dataDomainUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].dataDomainUrl
      minemap.serverDomainUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].domainUrl
      minemap.spriteUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].spriteUrl
      minemap.serviceUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].serviceUrl
      /**
       * appKey、solution设置
       */
      minemap.key = mineMapService['baseLayer_' + process.env.NODE_ENV].appKey
      minemap.appKey = mineMapService['baseLayer_' + process.env.NODE_ENV].appKey
      minemap.solution = solution
      return new minemap.Map({
        container: 'map',
        style: style /*底图样式*/,
        center: [longitude, latitude] /*地图中心点*/,
        zoom: zoom /*地图默认缩放等级*/,
        pitch: pitch | 0 /*地图俯仰角度*/,
        maxZoom: 17 /*地图最大缩放等级*/,
        minZoom: 3 /*地图最小缩放等级*/,
      })
    },
    /**
     * @desc  带dom
     * @author  Fallen Dai
     * @date  2022/1/16 12:29
     * return
     */
    initMapWithDom(longitude, latitude, zoom, domId) {
      minemap.domainUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].domainUrl
      minemap.dataDomainUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].domainUrl
      minemap.serverDomainUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].domainUrl
      minemap.spriteUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].spriteUrl
      minemap.serviceUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].serviceUrl
      /**
       * appKey、solution设置
       */
      // minemap.appKey = mineMapService['baseLayer_' + process.env.NODE_ENV].appKey
      minemap.key = mineMapService['baseLayer_' + process.env.NODE_ENV].appKey
      minemap.solution = mineMapService['baseLayer_' + process.env.NODE_ENV].solution3

      return new minemap.Map({
        container: domId,
        style: mineMapService['baseLayer_' + process.env.NODE_ENV].mineMapStyle3 /*底图样式*/,
        center: [longitude, latitude] /*地图中心点*/,
        zoom: zoom /*地图默认缩放等级*/,
        pitch: 0 /*地图俯仰角度*/,
        maxZoom: 17.5 /*地图最大缩放等级*/,
        minZoom: 3 /*地图最小缩放等级*/,
        projection: 'MERCATOR',
      })
    },

    /**
     *  重点路段配置底图
     * @param longitude
     * @param latitude
     * @param zoom
     * @param domId
     * @param solutionId
     * @returns {*}
     */
    initMapForKeyRoad(longitude, latitude, zoom, domId) {
      minemap.domainUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].domainUrl
      minemap.dataDomainUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].domainUrl
      minemap.serverDomainUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].domainUrl
      minemap.spriteUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].spriteUrl
      minemap.serviceUrl = mineMapService['baseLayer_' + process.env.NODE_ENV].serviceUrl
      /**
       * appKey、solution设置
       */
      // minemap.appKey = mineMapService['baseLayer_' + process.env.NODE_ENV].appKey
      minemap.key = mineMapService['baseLayer_' + process.env.NODE_ENV].appKey
      minemap.solution = mineMapService['baseLayer_' + process.env.NODE_ENV].solution3

      return new minemap.Map({
        container: domId,
        style: mineMapService['baseLayer_' + process.env.NODE_ENV].mineMapStyle3 /*底图样式*/,
        center: [longitude, latitude] /*地图中心点*/,
        zoom: zoom /*地图默认缩放等级*/,
        pitch: 0 /*地图俯仰角度*/,
        maxZoom: 17.5 /*地图最大缩放等级*/,
        minZoom: 3 /*地图最小缩放等级*/,
        projection: 'MERCATOR',
      })
    },

    getLoadedMineMapJsCss() {
      return loadedMineMapJsCss
    },
    // 点集合是否在平面内 points:要判断的点，areaCoordinates：平面所在的点集合
    isPointInRing(points, areaCoordinates) {
      return minemaputil.SpaceUtil.pointWithinPolygon(points, areaCoordinates)
    },

    //地图边界
    fitBoundingBox(map, bounds) {
      if (map && bounds) {
        // 经纬度矩形边界为一个矩形的经纬度范围，用西南角和东北角的两个经纬度来描述，这两个经纬度分别代表边界的最小值和最大值；
        // var bounds = [[116.40, 39.90],[116.49, 40.10]];//边界框
        map.fitBounds(bounds)
      }
    },

    // 定义一个CustomLayerInterface来在地图上绘制脉冲点
    createPulsingDot(map) {
      var size = 100
      var pulsingDot = null
      pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // 在图层添加到地图时获取获取canvas context
        onAdd: function () {
          var canvas = document.createElement('canvas')
          canvas.width = this.width
          canvas.height = this.height
          this.context = canvas.getContext('2d')
        },

        // 每帧渲染时调用
        render: function () {
          var duration = 1000
          var t = (performance.now() % duration) / duration

          var radius = (size / 2) * 0.3
          var outerRadius = (size / 2) * 0.7 * t + radius
          var context = this.context

          // 画外围圆
          context.clearRect(0, 0, this.width, this.height)
          context.beginPath()
          context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
          context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')'
          context.fill()

          // 画内圈圆
          context.beginPath()
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
          context.fillStyle = 'rgba(255, 100, 100, 1)'
          context.strokeStyle = 'white'
          context.lineWidth = 2 + 4 * (1 - t)
          context.fill()
          context.stroke()

          // 从canvas中更新图片数据
          this.data = context.getImageData(0, 0, this.width, this.height).data
          // 不断地重新绘制地图，导致平滑的动画点
          map.triggerRepaint()
          // 返回`true`让映射知道图像已经更新
          return true
        },
      }
      return pulsingDot
    },
    //点闪烁
    addPulsingSymbolLayer(map, layerId, pointJson) {
      let pulsingDot = this.createPulsingDot(map)
      if (!map.hasImage('pulsing-dot')) {
        map.addImage('pulsing-dot', pulsingDot, {
          pixelRatio: 2,
        })
      }
      this.addMapSourceGeojson(map, 'points', pointJson)
      map.addLayer({
        id: layerId,
        type: 'symbol',
        source: 'points',
        layout: {
          'icon-image': 'pulsing-dot',
          //是否允许图片压盖
          'icon-allow-overlap': true,
        },
      })
    },

    //添加数据源
    addMapSource(map, sourceName, coordinates, dataUrl) {
      this.removeDataSource(map, sourceName)
      if (dataUrl) {
        map.addSource(sourceName, {
          type: 'geojson',
          data: dataUrl,
          cluster: true,
          clusterMaxZoom: 15 /* 最大聚合层级 */,
          clusterRadius: 200 /* 聚合半径 */,
        })
      } else {
        var jsonData = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [coordinates],
              },
              properties: {
                adcode: sourceName,
              },
            },
          ],
        }
        map.addSource(sourceName, {
          type: 'geojson',
          data: jsonData,
          promoteId: 'adcode',
        })
      }
    },
    //添加数据源(数据源为多个面、线等的情况下使用)
    addMapSourceList(map, sourceName, coordinatesList) {
      this.removeDataSource(map, sourceName)
      var features = []
      coordinatesList.forEach((coordinates, index) => {
        var oneJson = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
          },
          properties: {
            adcode: index + 1,
          },
        }
        features.push(oneJson)
      })
      var jsonData = {
        type: 'FeatureCollection',
        features: features,
      }
      map.addSource(sourceName, {
        type: 'geojson',
        data: jsonData,
        promoteId: 'adcode',
      })
    },
    //添加数据源(geojson格式数据)
    addMapSourceGeojson(map, sourceName, geoJsonData, idName) {
      this.removeDataSource(map, sourceName)
      map.addSource(sourceName, {
        type: 'geojson',
        data: geoJsonData,
        promoteId: idName,
      })
    },
    //清除数据源
    removeDataSource(map, sourceName) {
      if (map.getSource(sourceName)) {
        map.removeSource(sourceName)
      }
    },
    //添加图片源
    addImageIcon(map, imgUrl, imgSourceName) {
      map.loadImage(require('@/assets/map/' + imgUrl), function (error, image) {
        if (error) throw error
        if (!map.hasImage(imgSourceName)) {
          map.addImage(imgSourceName, image)
        }
      })
    },
    // addImageIcon2(map,imgUrl,imgSourceName){
    //   map.addSource(imgSourceName, { /*imageSource代表数据源ID，是唯一的，不能重复*/
    //     "type": "image",   /*数据源类型*/
    //     "url": imgUrl,    /*图像url地址*/
    //     // "coordinates": [[116.45, 39.93],[116.47, 39.93],[116.47, 39.91],[116.45, 39.91]]
    //     /*图像在地图上的坐标点边界，边界值为顺时针方式，依次为：左上、右上、右下、左下。*/
    //   });
    // },
    //添加面图层
    addMapFillLayer(map, fillLayerId, sourceName, color) {
      this.removeMapLayer(map, fillLayerId)
      if (!color) {
        color = '#73c0de'
      }
      this.baseMap.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: sourceName,
        layout: {
          visibility: 'visible',
        },
        paint: {
          'fill-color': color,
          'fill-opacity': 0.5,
          'fill-outline-color': '#0eabf0',
        },
        minzoom: 3,
        maxzoom: 17.5,
      })
    },
    //添加面图层
    addMaphoverFillLayer(map, fillLayerId, sourceName, color) {
      this.removeMapLayer(map, fillLayerId)
      if (!color) {
        color = '#73c0de'
      }
      this.baseMap.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: sourceName,
        layout: {
          visibility: 'visible',
        },
        paint: {
          'fill-color': color,
          'fill-opacity': 0.2,
          'fill-outline-color': '#0eabf0',
          'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.5, 0],
        },
        minzoom: 3,
        maxzoom: 17.5,
      })
    },
    //添加线图层 isStops 是否使用函数对象语句
    addMapLineLayer(map, lineLayerId, sourceName, lineWidth, lineColor, lineType, isStops) {
      this.removeMapLayer(map, lineLayerId)
      if (!lineWidth) {
        lineWidth = 3
      }
      if (!lineColor) {
        lineColor = '#fe2a27'
      }
      //lineType存在时虚线
      var lineDasharray = [2]
      if (lineType) {
        lineDasharray = [2, 4]
      }
      var lineWidthObj = lineWidth
      if (isStops) {
        lineWidthObj = {
          stops: [
            [7, 4],
            [10, 5],
            [12, 6],
            [15, 7],
          ],
          base: lineWidth,
        }
      }
      map.addLayer({
        id: lineLayerId,
        type: 'line',
        source: sourceName,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'border-visibility': 'visible', //是否开启线边框
        },
        paint: {
          'line-dasharray': lineDasharray,
          'line-color': {
            // 'type': 'categorical',
            type: 'interval', // 分段式
            property: 'startNum',
            stops: [
              [0, '#43CB29'],
              [30, '#DEBD3D'],
              [60, '#0B46F0'],
              [90, '#890CDA'],
            ],
            default: lineColor,
          },
          'line-width': lineWidthObj,
          'line-border-width': 1, //设置线边框宽度
          'line-border-opacity': 0.5, //设置线边框透明度
          'line-border-color': '#0b46f0', //设置线边框颜色
        },
        minzoom: 3,
        maxzoom: 17.5,
      })
    },
    /**
     * 移除图层
     * @param map
     * @param layerId
     * @param closeRepaint boolean 是否重画 注：该参数针对轨迹图层，移除所有轨迹图层时可以设为false,减少浏览器性能损耗
     */
    removeMapLayer(map, layerId, closeRepaint) {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId)
      }
      //只做关闭操作
      if (closeRepaint) {
        map.repaint = false
      }
    },
    //地图平移
    mapMove(map, gisx, gisy) {
      if (gisx && gisy) {
        map.panTo([gisx, gisy])
      }
    },
    //地图飞行
    mapFly(map, gisX, gisY, zoom, pitchtemp, duration,bearing) {
      var centerCood = [119.77611, 25.505156]
      if (gisX && gisY) {
        centerCood = [gisX, gisY]
      }
      if (!duration) {
        //飞行时间，默认2秒
        duration = 2000
      }
      if (!zoom) {
        //默认地图等级11
        zoom = 11
      }
      if (!pitchtemp) {
        pitchtemp = 0
      }
      if (!bearing) {
        bearing = 0
      }
      map.easeTo({
        //飞行中心点
        center: centerCood,
        zoom: zoom,
        bearing: bearing,
        pitch: pitchtemp,
        duration: duration,
      })
    },
    uuid(len, radix) {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
      const uuid = []
      let i
      radix = radix || chars.length
      if (len) {
        for (i = 1; i < len; i++) {
          uuid[i] = chars[0 | (Math.random() * radix)]
        }
      } else {
        let r
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'
        for (i = 1; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | (Math.random() * 16)
            uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
          }
        }
      }
      uuid[0] = 'a'
      return uuid.join('')
    },
    //地图打点（添加marker）
    createMarkerObject(
      coordinates,
      clickMethod,
      popupInMethod,
      imgName,
      popupOutMethod,
      clickType,
      imgWidth,
      imgHeight,
      pointIndex
    ) {
      var markerId = this.uuid()
      if (!coordinates) {
        return this.$message.warning('未指定坐标点！')
      }
      if (!imgWidth) {
        imgWidth = 40
      }
      if (!imgHeight) {
        imgHeight = 50
      }
      if (!clickType) {
        clickType = 'click'
      }
      if (!pointIndex) {
        pointIndex = 1
      }
      var markerObj = {
        markerId: markerId,
        imgName: imgName,
        imgWidth: imgWidth,
        imgHeight: imgHeight,
        coordinates: coordinates,
        clickType: clickType,
        clickMethod: clickMethod,
        popupInMethod: popupInMethod,
        popupOutMethod: popupOutMethod,
        pointIndex: pointIndex,
      }
      return markerObj
    },
    //地图打点（添加marker）
    addMapMarker(map, markerObj, type) {
      if (!markerObj.coordinates) {
        return
      }
      let anchorTmp = 'bottom'
      // 自定义点标记的内部DOM元素
      var el = document.createElement('div')
      el.id = markerObj.markerId
      if (markerObj.imgName) {
        var imageurl = require('@/assets/map/' + markerObj.imgName)
        el.style['background-image'] = 'url(' + imageurl + ')'
      } else {
        var imageurl = require('@/assets/images/map/point.png')
        el.style['background-image'] = 'url(' + imageurl + ')'
      }
      el.style['background-size'] = 'cover'
      el.style.width = markerObj.imgWidth + 'px'
      el.style.height = markerObj.imgHeight + 'px'
      el.style.zIndex = markerObj.pointIndex
      if (markerObj.popupInMethod) {
        //移入
        el.addEventListener('mouseenter', markerObj.popupInMethod)
      }
      if (markerObj.popupOutMethod) {
        //移出
        el.addEventListener('mouseleave', markerObj.popupOutMethod)
      }
      if (markerObj.clickType && markerObj.clickMethod) {
        el.addEventListener(markerObj.clickType, markerObj.clickMethod)
      }
      var _marker = new minemap.Marker(el, {
        // offset: [markerObj.imgWidth, 0], // 左右，上下
        anchor: anchorTmp, //锚点
        rotation: 0, // marker的旋转角度，以锚点作为旋转中心点，顺时针为正
        pitchAlignment: 'auto', // 倾斜对齐参数(默认值是‘auto’)，此值决定marker标记是贴在地图平面上，还是立在地图平面上，当值为`map`时，marker标记贴在地图平面上，当值为`viewport`时，marker标记立在地图平面上，当值为 `auto`时，会根据 `rotationAlignment`参数的值，自动决定.
        rotationAlignment: 'auto', // 旋转对齐参数(默认值是‘auto’)，此值决定地图在旋转的时候，marker标记是否跟随旋转，当值为`map` 时，marker标记会固定在地图平面上，不会跟随地图的旋转而旋转；当值为`viewport`时，marker标记会跟随地图的旋转而旋转，保持正向面对观察者；当值为`auto`时，相当于值`viewport`.
      })
        .setLngLat(markerObj.coordinates)
        .setZIndex(markerObj.pointIndex)
        .addTo(map)
      return _marker
    },
    //添加信息体
    addMapPopup(map, content, coordinates) {
      var el = document.createElement('div')
      el.className = 'custom-popup-class' //custom-popup-class为自定义的css类名
      var d1 = document.createElement('div')
      el.className = 'custom-popup-content' //custom-popup-content为自定义的css类名
      d1.innerHTML = '<span>' + content + '</span>'
      d1.style.color = 'black'
      el.appendChild(d1)
      var popup = new minemap.Popup({ closeOnClick: false, closeButton: false, anchor: 'bottom', offset: [0, -48] })
        .setLngLat(coordinates)
        .setDOMContent(el)
        .addTo(map)
      return popup
    },
    addMapPopupSpecial(map, equipName, content, coordinates, fColor) {
      var el = document.createElement('div')
      el.style.zIndex = popupIndex
      el.className = 'custom-popup-class MapPopupSpecial' //custom-popup-class为自定义的css类名
      var d1 = document.createElement('div')
      d1.className = 'custom-popup-title' //custom-popup-content为自定义的css类名
      d1.innerHTML = '<span>' + equipName + '</span>'
      el.appendChild(d1)
      var d2 = document.createElement('div')
      d2.className = 'custom-popup-content' //custom-popup-content为自定义的css类名
      if (fColor == '红色') {
        d2.innerHTML = '<div class="empty-border red"><span>' + content + '</span></div>'
      } else if (fColor == '黄色') {
        d2.innerHTML = '<div class="empty-border yellow"><span>' + content + '</span></div>'
      } else {
        d2.innerHTML = '<div class="empty-border"><span>' + content + '</span></div>'
      }
      el.appendChild(d2)
      var d3 = document.createElement('div')
      d3.className = 'custom-popup-tips' //custom-popup-tips为自定义的css类名
      el.appendChild(d3)
      var popup = new minemap.Popup({ closeOnClick: false, closeButton: false, anchor: 'bottom', offset: [0, -62] })
        .setLngLat(coordinates)
        .setDOMContent(el)
        .addTo(map)
      popup.addClassName('map-popup')
      return popup
    },
    // //特殊信息窗体（测试用）
    // addMapPopupSpecial(map,serial, title,content, coordinates) {
    //   console.log('%c [ coordinates ]-509', 'font-size:13px; background:pink; color:#bf2c9f;', coordinates)
    //   var el = document.createElement('div');
    //   el.className = 'custom-popup-class'; //custom-popup-class为自定义的css类名
    //   var d1 = document.createElement('div');
    //   d1.className = 'custom-popup-title'; //custom-popup-content为自定义的css类名
    //   d1.innerHTML = '<span class="serial ">'+serial+'</span>'+'<span class="title">'+title+'</span>'+'<span class="content">'+content+'</span>';
    //   el.appendChild(d1);
    //   // var d2 = document.createElement('div');
    //   // d2.className = 'custom-popup-content'; //custom-popup-content为自定义的css类名
    //   // d2.innerHTML = '<div class="empty-border"><span>进入隧道，谨慎驾驶</span></div>';
    //   // el.appendChild(d2);
    //   // var d3 = document.createElement('div');
    //   // d3.className = 'custom-popup-tips'; //custom-popup-tips为自定义的css类名
    //   // el.appendChild(d3);
    //   var popup = new minemap.Popup({closeOnClick: false, closeButton: false, anchor: 'bottom',  pitchAlignment: 'auto', rotationAlignment: 'auto',offset: [0, -64]})
    //     .setLngLat(coordinates)
    //     .setDOMContent(el)
    //     .addTo(map);
    //   popup.addClassName('map-popup')
    //   return popup;
    // },
    // 服务区打点不动效果
    addMapMarkerSerial(map, markerObj, type) {
      if (!markerObj.coordinates) {
        return
      }
      let anchorTmp = 'bottom'
      // 自定义点标记的内部DOM元素
      var el = document.createElement('div')
      var imageurl = require('@/assets/map/' + markerObj.imgName)
      el.style['background-image'] = 'url(' + imageurl + ')'
      el.style['background-size'] = '100% 100%'
      el.className = 'custom-popup-class' //custom-popup-class为自定义的css类名
      var d1 = document.createElement('div')
      d1.className = 'custom-popup-title' //custom-popup-content为自定义的css类名
      d1.innerHTML =
        '<div class="serial">' +
        markerObj.serial +
        '</div>' +
        '<div class="title">' +
        markerObj.title +
        '</div>' +
        '<div class="content">' +
        markerObj.content +
        '</div>'
      el.appendChild(d1)
      el.id = markerObj.markerId
      el.style.width = markerObj.imgWidth + 'px'
      el.style.height = markerObj.imgHeight + 'px'
      el.style.zIndex = markerObj.pointIndex
      if (markerObj.popupInMethod) {
        //移入
        el.addEventListener('mouseenter', markerObj.popupInMethod)
      }
      if (markerObj.popupOutMethod) {
        //移出
        el.addEventListener('mouseleave', markerObj.popupOutMethod)
      }
      if (markerObj.clickType && markerObj.clickMethod) {
        el.addEventListener(markerObj.clickType, markerObj.clickMethod)
      }
      var _marker = new minemap.Marker(el, {
        // offset: [markerObj.imgWidth/2, 0], // 左右，上下
        anchor: anchorTmp, //锚点
        rotation: 0, // marker的旋转角度，以锚点作为旋转中心点，顺时针为正
        pitchAlignment: 'auto', // 倾斜对齐参数(默认值是‘auto’)，此值决定marker标记是贴在地图平面上，还是立在地图平面上，当值为`map`时，marker标记贴在地图平面上，当值为`viewport`时，marker标记立在地图平面上，当值为 `auto`时，会根据 `rotationAlignment`参数的值，自动决定.
        rotationAlignment: 'auto', // 旋转对齐参数(默认值是‘auto’)，此值决定地图在旋转的时候，marker标记是否跟随旋转，当值为`map` 时，marker标记会固定在地图平面上，不会跟随地图的旋转而旋转；当值为`viewport`时，marker标记会跟随地图的旋转而旋转，保持正向面对观察者；当值为`auto`时，相当于值`viewport`.
      })
        .setLngLat(markerObj.coordinates)
        .setZIndex(markerObj.pointIndex)
        .addTo(map)
      return _marker
    },
    // 天气打点弹窗效果细节
    addMapMarkerWeather(map, markerObj, weatherPopData) {
      if (!markerObj.coordinates) {
        return
      }
      let anchorTmp = 'bottom-left'
      // 自定义点标记的内部DOM元素
      var imageurl2 = require('@/assets/weatherIcon/' + weatherPopData.detailIcon)
      var el = document.createElement('div')
      el.className = 'weather-popup-main'
      var d1 = document.createElement('div')
      d1.className = 'detail'
      d1.style['background-image'] = 'url(' + imageurl2 + ')'
      d1.innerHTML =
        '<div class="info"><span>' + weatherPopData.tmp + '}}°</span><br />' + weatherPopData.weather + '</div>'
      var d2 = document.createElement('div')
      d2.className = 'message' //custom-popup-content为自定义的css类名
      d2.innerHTML =
        '<div class="part part1"> 相对湿度：<span>' +
        weatherPopData.visibility +
        '%</span></div><div class="part part2">' +
        weatherPopData.windDir +
        '：<span>' +
        weatherPopData.windSc +
        '</span></div><div class="part part3">能见度<span>>' +
        weatherPopData.visibility +
        'km</span> </div>'
      var d3 = document.createElement('div')
      d3.className = 'updateTime' //custom-popup-content为自定义的css类名
      d3.innerHTML = '更新时间：16:32:33'
      el.appendChild(d1)
      el.appendChild(d2)
      el.appendChild(d3)
      el.id = markerObj.markerId
      el.style.width = markerObj.imgWidth + 'px'
      el.style.height = markerObj.imgHeight + 'px'
      el.style.zIndex = markerObj.pointIndex
      if (markerObj.popupInMethod) {
        //移入
        el.addEventListener('mouseenter', markerObj.popupInMethod)
      }
      if (markerObj.popupOutMethod) {
        //移出
        el.addEventListener('mouseleave', markerObj.popupOutMethod)
      }
      if (markerObj.clickType && markerObj.clickMethod) {
        el.addEventListener(markerObj.clickType, markerObj.clickMethod)
      }
      var _marker = new minemap.Marker(el, {
        // offset: [markerObj.imgWidth, 0], // 左右，上下
        anchor: anchorTmp, //锚点
        rotation: 0, // marker的旋转角度，以锚点作为旋转中心点，顺时针为正
        pitchAlignment: 'auto', // 倾斜对齐参数(默认值是‘auto’)，此值决定marker标记是贴在地图平面上，还是立在地图平面上，当值为`map`时，marker标记贴在地图平面上，当值为`viewport`时，marker标记立在地图平面上，当值为 `auto`时，会根据 `rotationAlignment`参数的值，自动决定.
        rotationAlignment: 'auto', // 旋转对齐参数(默认值是‘auto’)，此值决定地图在旋转的时候，marker标记是否跟随旋转，当值为`map` 时，marker标记会固定在地图平面上，不会跟随地图的旋转而旋转；当值为`viewport`时，marker标记会跟随地图的旋转而旋转，保持正向面对观察者；当值为`auto`时，相当于值`viewport`.
      })
        .setLngLat(markerObj.coordinates)
        .setZIndex(markerObj.pointIndex)
        .addTo(map)
      return _marker
    },

    // 地图上打点Maker
    addMarkerToMap(map, markerObj, type) {
      if (!markerObj.coordinates) {
        return
      }
      let anchorTmp = 'bottom'
      // 自定义点标记的内部DOM元素
      var el = document.createElement('div')
      el.className = 'custom-popup-class' //custom-popup-class为自定义的css类名
      var d1 = document.createElement('div')
      d1.className = 'custom-popup-title' //custom-popup-content为自定义的css类名
      if (type == 'flow') {
        d1.innerHTML =
          '<div class="eui-mapDot eui-mapDot2 blueBg">' +
            '<b class="name">' + markerObj.title + '</b>' +
            '<p><span>门架</span><b>' + markerObj.content + '</b></p>'+
            '<p><span>省界门架</span><b>' + markerObj.num + '</b></p>'
            + '</div>'
      } else if (type == 'flowShi') {
        d1.innerHTML =
          '<div class="eui-mapDot13"></div>'
      } else if (type == 'tollGate') {
        let style = 'grayBg'
        if (markerObj.title == '福州市') {
          style = 'redBg'
        } else if (markerObj.title == '南平市') {
          style = 'orangeBg'
        } else if (markerObj.title == '泉州市') {
          style = 'greenBg'
        }
        d1.innerHTML =
          '<div class="eui-mapDot eui-mapDot3 ' + style +'">' +
            '<span><b>' + markerObj.content + '</b>个</span>'
            + '</div>'
      } else if (type == 'tollGateShi') {
        d1.innerHTML =
          '<div class="eui-mapDot eui-mapDot4">' +
            // '<p class="name">' + markerObj.title + '</p>' +
            '<div class="bt-bg"></div>'
            + '</div>'
      } else if (type == 'Board') {
        d1.innerHTML =
          '<div class="eui-mapDot eui-mapDot5">'
            + '<div class="bg"></div>'
            + '<span class="per">' + markerObj.content + '</span>'
            + '<p class="name">' + markerObj.title + '</p>'
            + '</div>'
      } else if (type == 'Camera') {
        d1.innerHTML =
          '<div class="eui-mapDot eui-mapDot5">'
            + '<div class="bg2"></div>'
            + '<span class="per">' + markerObj.content + '</span>'
            + '<p class="name">' + markerObj.title + '</p>'
            + '</div>'
      } else if (type == 'Portal') {
        d1.innerHTML =
          '<div class="eui-mapDot eui-mapDot5">'
            + '<div class="bg3"></div>'
            + '<span class="per">' + markerObj.content + '</span>'
            + '<p class="name">' + markerObj.title + '</p>'
            + '</div>'
      } else if (type == 'serviceArea') {
          var htmlC =
                '<div class="five-star">' +
                '</div>' +
                '<div class="t">' +
                markerObj.content +
                '</div>'
          d1.innerHTML =
            '<div class="eui-map-pop">' +
              '<div class="pop-panel">' +
                '<div class="title">' +
                  '<div class="t">' +
                  markerObj.title +
                  '</div>' +
                '</div>' +
                '<div class="row">' +
                  htmlC +
                '</div>' +
              '</div>' +
              '<div class="pop-pointer"></div>' +
            '</div>'
      } else if (type == 'serviceAreaShi') {
          var htmlC = ''
          if (markerObj.starRate == 5) {
            htmlC =
                '<div class="five-star">' +
                '</div>'
            d1.innerHTML =
              '<div class="eui-map-pop">' +
                '<div class="pop-panel">' +
                  '<div class="title">' +
                    '<div class="t">' +
                    markerObj.title +
                    '</div>' +
                  '</div>' +
                  '<div class="row">' +
                    htmlC +
                  '</div>' +
                '</div>' +
                '<div class="pop-pointer"></div>' +
              '</div>'
              markerObj.pointIndex = 2
          } else if (markerObj.starRate == 4) {
            htmlC =
                '<div class="four-star">' +
                '</div>'
            d1.innerHTML =
              '<div class="eui-map-pop">' +
                '<div class="pop-panel">' +
                  '<div class="title">' +
                    '<div class="t">' +
                    markerObj.title +
                    '</div>' +
                  '</div>' +
                  '<div class="row">' +
                    htmlC +
                  '</div>' +
                '</div>' +
                '<div class="pop-pointer"></div>' +
              '</div>'
              markerObj.pointIndex = 2
          } else {
            d1.innerHTML =
              '<div class="eui-mapDot eui-mapDot4">' +
                // '<p class="name2">' + markerObj.title + '</p>' +
                '<div class="bt-bg2"></div>'
                + '</div>'
          }
      } else if (type == 'serviceShengTop' || type == 'serviceShiTop') {
        let bgHtml = 'big-other'
        let indexHtml = '<div class="index">' +  + markerObj.index + '</div>'
        if (markerObj.index <= 3) {
          bgHtml = 'big' + markerObj.index
          indexHtml = ''
        }
        d1.innerHTML =
              '<div class="eui-mapDot eui-mapDot7 bg-small ' + bgHtml + '">' +
                '<div class="name">' + markerObj.title + '</div>' +
                '<div class="content">' + markerObj.content + '</div>' +
                indexHtml
                + '</div>'
      }
      el.appendChild(d1)
      el.id = markerObj.markerId
      el.style.width = markerObj.imgWidth + 'px'
      el.style.height = markerObj.imgHeight + 'px'
      el.style.zIndex = markerObj.pointIndex
      if (markerObj.popupInMethod) {
        //移入
        el.addEventListener('mouseenter', markerObj.popupInMethod)
      }
      if (markerObj.popupOutMethod) {
        //移出
        el.addEventListener('mouseleave', markerObj.popupOutMethod)
      }
      if (markerObj.clickType && markerObj.clickMethod) {
        el.addEventListener(markerObj.clickType, markerObj.clickMethod)
      }
      var _marker = new minemap.Marker(el, {
        // offset: [markerObj.imgWidth/2, 0], // 左右，上下
        anchor: anchorTmp, //锚点
        rotation: 0, // marker的旋转角度，以锚点作为旋转中心点，顺时针为正
        pitchAlignment: 'auto', // 倾斜对齐参数(默认值是‘auto’)，此值决定marker标记是贴在地图平面上，还是立在地图平面上，当值为`map`时，marker标记贴在地图平面上，当值为`viewport`时，marker标记立在地图平面上，当值为 `auto`时，会根据 `rotationAlignment`参数的值，自动决定.
        rotationAlignment: 'auto', // 旋转对齐参数(默认值是‘auto’)，此值决定地图在旋转的时候，marker标记是否跟随旋转，当值为`map` 时，marker标记会固定在地图平面上，不会跟随地图的旋转而旋转；当值为`viewport`时，marker标记会跟随地图的旋转而旋转，保持正向面对观察者；当值为`auto`时，相当于值`viewport`.
      })
        .setLngLat(markerObj.coordinates)
        .setZIndex(markerObj.pointIndex)
        .addTo(map)
      return _marker
    },

    getPopupToMarker(map, longitude, latitude, html, offsetY, offsetX) {
      let offY = offsetY ? offsetY : 0
      let offX = offsetX ? offsetX : 0
      var pop =  new minemap.Popup({
        closeOnClick: false,
        closeButton: false,
        anchor: 'bottom',
        offset: [offX, offY]
      }).setLngLat([longitude, latitude]).setHTML(html).addTo(map);
      return pop
    },

    //省界门架打点
    addSjPortal(map, markerObj, index) {
      if (!markerObj.coordinates) {
        return
      }
      let anchorTmp = 'bottom'
      // 自定义点标记的内部DOM元素
      var el = document.createElement('div')
      el.className = 'custom-popup-class' //custom-popup-class为自定义的css类名
      var d1 = document.createElement('div')
      d1.className = 'custom-popup-title' //custom-popup-content为自定义的css类名
      let style = "greenBg"
      if(markerObj.areaCode == "1"){
        style = "redBg";
      }else if(markerObj.areaCode == "2"){
        style = "orangeBg";
      }
      d1.innerHTML = '<div style="font-size: 13px" class="eui-mapDot eui-mapDot1 ' + style +'"><div class="name">' + markerObj.title + '</div></div>'
      el.appendChild(d1)
      el.id = markerObj.markerId
      el.style.width = markerObj.imgWidth + 'px'
      el.style.height = markerObj.imgHeight + 'px'
      // el.style.top = '-27px'
      el.style.zIndex = markerObj.pointIndex
      if (markerObj.popupInMethod) {
        //移入
        el.addEventListener('mouseenter', markerObj.popupInMethod)
      }
      if (markerObj.popupOutMethod) {
        //移出
        el.addEventListener('mouseleave', markerObj.popupOutMethod)
      }
      if (markerObj.clickType && markerObj.clickMethod) {
        el.addEventListener(markerObj.clickType, markerObj.clickMethod)
      }
      var _marker = new minemap.Marker(el, {
        anchor: anchorTmp, //锚点
      })
        .setLngLat(markerObj.coordinates)
        .setZIndex(markerObj.pointIndex)
        .addTo(map)
      return _marker
    },

    //清除点
    removeAllPoint(markers) {
      if (markers.length > 0) {
        markers.forEach((marker) => {
          marker.remove()
        })
      }
    },
    //要素交互(鼠标移入)
    mousemoveFill(map, layerId, sourceName) {
      map.on('mousemove', layerId, function (e) {
        if (e.features.length > 0) {
          if (hoveredStateId) {
            map.setFeatureState(
              {
                source: sourceName,
                id: hoveredStateId,
              },
              {
                hover: false,
              }
            )
          }
          hoveredStateId = e.features[0].layer.id
          map.setFeatureState(
            {
              source: sourceName,
              id: hoveredStateId,
            },
            {
              hover: true,
            }
          )
          localStorage.setItem('hoveredStateId', hoveredStateId)
        }
      })
    },
    //要素交互(鼠标移出)
    mouseleaveFill(map, layerId, sourceName) {
      map.on('mouseleave', layerId, function () {
        if (hoveredStateId) {
          map.setFeatureState(
            {
              source: sourceName,
              id: hoveredStateId,
            },
            {
              hover: false,
            }
          )
        }
        hoveredStateId = null
      })
    },
    //给指定的图层增加事件，图层可以支持的事件种类请在API文档的Map#on方法中查看
    // map.on("click", "circleLayer-1000", function () {
    //     addSourceAndLayer(0.2 * Math.random())
    // });
    //点扩散
    pointDiffuse(map, gisX, gixY, time) {
      if (gisX && gixY && gisX != 0 && gixY != 0) {
        this.removePointDiffuse()
        // if(setTime){
        //   clearTimeout(setTime)
        // }
        var el = document.createElement('div')
        el.style.zIndex = ringPointIndex
        // var p = document.createElement('div');
        // p.className = 'ring-point-marker';
        // var p1 = document.createElement('div');
        // p1.className = 'ring-point-inner1';
        // var p2 = document.createElement('div');
        // p2.className = 'ring-point-inner2';
        // var p3 = document.createElement('div');
        // p3.className = 'ring-point-inner3';
        // p.appendChild(p1);
        // p.appendChild(p2);
        // p.appendChild(p3);
        // el.appendChild(p);

        // 添加gif效果
        var p = document.createElement('div')
        p.className = 'ring-point-marker'
        el.appendChild(p)
        //添加marker
        var marker = new minemap.Marker(el, { offset: [-34, -50] })
          .setLngLat([gisX, gixY])
          .setZIndex(ringPointIndex)
          .addTo(map)
        diffuseMarkers.push(marker)
        // setTime = setTimeout(() => {
        //   this.removePointDiffuse()
        // }, time);
      }
    },
    //清除点扩散
    removePointDiffuse() {
      if (diffuseMarkers.length !== 0) {
        for (var i = 0; i < diffuseMarkers.length; i++) {
          diffuseMarkers[i].remove()
        }
        diffuseMarkers = []
      }
    },

    //添加圆点图层
    addCircleLayer(map, layerId, sourceName) {
      map.addLayer({
        id: layerId,
        type: 'circle',
        source: sourceName,
        layout: {
          visibility: 'visible',
        },
        paint: {
          'circle-radius': 7,
          'circle-color': {
            type: 'interval', //分块式
            property: 'tfPower',
            stops: [
              [1, '#0000ff'],
              [8, '#fee349'],
              [10, '#f68a1e'],
              [12, '#ff1d17'],
            ],
            default: '#0000ff',
          },
          'circle-opacity': 0.8,
          'circle-stroke-width': 2, //表示圆的边框宽度，值必须大于等于0，默认为0；支持函数对象语句；
          'circle-stroke-color': '#000000', //表示圆的边框颜色，默认值为"#000000"；支持函数对象语句；
          'circle-stroke-opacity': 0.8, //表示圆的边框不透明度，值域为[0,1]，默认为1；支持函数对象语句；
        },
        minzoom: 3,
        maxzoom: 17.5,
      })
    },

    /**
     * 路径规划接口
     * @param startGis 起点坐标 格式：'117.9076404,25.94208'
     * @param endGis 目的地坐标 格式：'117.9076404,25.94208'
     * @returns {Promise<*>}
     */
    async routePlan(startGis, endGis) {
      return minemap.service
        .drivingData({
          origin: startGis,
          destination: endGis,
        })
        .then((res) => {
          //处理路径规划点位
          var coordinatesList = []
          var data = res.data
          if (data.status == 0) {
            var result = data.result
            //规划路线数量
            var count = result.count
            for (var i = 0; i < count; i++) {
              var steps = result.routes[i].steps
              //路径规划所有点位
              var allPolyline = ''
              for (let j in steps) {
                if (j == steps.length - 1) {
                  allPolyline += steps[j].polyline
                } else {
                  allPolyline += steps[j].polyline + ';'
                }
              }
              var coordinates = []
              var polyLines = allPolyline.split(';')
              for (let z in polyLines) {
                var point = polyLines[z].split(',')
                coordinates.push([Number(point[0]), Number(point[1])])
              }
              coordinatesList.push(coordinates)
            }
          }
          return coordinatesList
        })
    },

    /**
     * 图标轨迹
     * @param map
     * @param layerId 图层id
     * @param sourceName 数据源名称
     * @param route 点位集合 格式：二维数组 例：[[lng1,lat1][lng2,lat2]]
     * @param imageSourceName 图片源名称
     * @param time 走完时长
     */
    imageTrackLayer(map, layerId, sourceName, route, imageSourceName, speed) {
      //将点位集合转化为点位geojson数据(需引入相关js)
      var jsonData = minemap.Template.util.pointArrayToSymtrackingGeoJson(route, false)
      var length = jsonData.features.length
      //添加轨迹数据源
      this.addMapSourceGeojson(this.baseMap, sourceName, jsonData)
      //开启地图重画功能，只有开启图片才会移动
      map.repaint = true
      let time = Math.fround(length / speed)
      map.addLayer({
        type: 'symtracking',
        source: sourceName,
        id: layerId,
        layout: {
          'icon-image': imageSourceName,
          'icon-allow-overlap': false,
          'icon-ignore-placement': true,
          'symbol-avoid-edges': false,
          'symbol-placement': 'line',
          'symtracking-fps': speed, //行动快慢，默认设定时间内走完
          'symtracking-time-segment': time, //总共要运行多少秒
          'compatible-mode': false, //notice  采用新的数据样式，保证小车不消失
        },
        paint: {
          'icon-color': '#ff0000',
          'symtracking-delay': 0, //notice 小车更新延迟为零，保证小车能够循环播放，小车循环播放的条件是：此项为零 并且 symtracking-fps * symtracking-time-segment ≈ myGeojson.features.length
        },
      })
      return time
    },

    addMapTextLayer(map, layerId, sourceName, titleName) {
      map.addLayer({
        id: layerId,
        type: 'symbol',
        source: sourceName,
        layout: {
          visibility: 'visible',
          'icon-image': 'marker-15-6',
          'text-field': '{' + titleName + '}',
          'text-offset': [0, 0.6],
          'text-anchor': 'top',
          'text-size': 14,
          'icon-allow-overlap': true, //图标允许压盖
          'text-allow-overlap': true, //图标覆盖文字允许压盖
        },
        paint: {
          'text-color': {
            type: 'categorical',
            property: 'kind',
            stops: [
              ['school', '#ff0000'],
              ['park', '#00ff00'],
              ['hospital', '#0000ff'],
            ],
            default: '#ff0000',
          },
          'text-halo-color': '#000000',
          'text-halo-width': 0.5,
        },
        minzoom: 7,
        maxzoom: 17.5,
      })
    },
    //添加点图层
    addSymbolLayer(map, layerName, sourceName, imgName, iconSize, serviceType) {
      if (!iconSize) {
        iconSize = 1
      }
      if (serviceType) {
        //显示掩藏服务图层
        map.addLayer({
          id: layerName,
          type: 'symbol',
          // 数据源名称
          source: sourceName,
          // 和数据源名称保持一致
          'source-layer': sourceName,
          layout: {
            'icon-image': imgName,
            'icon-size': iconSize,
            'icon-anchor': 'bottom',
          },
        })
      } else {
        map.addLayer({
          id: layerName,
          type: 'symbol',
          // 数据源名称
          source: sourceName,
          layout: {
            //是否允许图片压盖
            'icon-allow-overlap': true,
            'icon-image': imgName,
            'icon-size': iconSize,
            'icon-anchor': 'bottom',
          },
        })
      }
    },
    //图层过滤
    layerFilter(map, layerName, filter) {
      if (map.getLayer(layerName)) {
        map.setFilter(layerName, filter)
      }
    },
    // 迁徙图功能
    addMigrationMap(data) {
      this.removeMigraLayer()
      var option = this.getOption(this.getSeries(data))
      /**
       * 创建一个echartslayer，并调用echartslayer.chart.setOption 这个charts就是echarts.init 返回的实例
       */
      echartslayer = minemap.Template.create({ map: this.baseMap, type: 'od', id: 'echartslayer', status: true })
      echartslayer.chart.setOption(option)
      // 移动层级
      // this.mapFly(this.baseMap, 115.802451, 26.945714, 5.9, '', 2)
    },
    getSeries(data) {
      var scatterData = []
      var lineData = []
      // var min = Number.MAX_VALUE
      // var max = Number.MIN_VALUE
      var min = 0
      var max = 100

      for (var i = 0; i < data.length; i++) {
        var item = data[i]
        var name = item[4]
        var dest = item[5]
        var count = item[6]

        if (count < min) {
          min = count
        }
        if (count > max) {
          max = count
        }
        scatterData.push({
          name: dest,
          count: count,
          value: item.slice(2, 4),
        })
        lineData.push({
          name: name,
          count: count,
          dest: dest,
          coords: [item.slice(0, 2), item.slice(2, 4)],
        })
      }

      var colors = ['#00F8FF', '#00FF00', '#FFF800', '#FF0000']

      var getColor = function (param) {
        var factor = (param.data.count - min) / (max - min)
        var index = Math.round(colors.length * factor)
        return colors[index]
      }
      return [
        {
          name: 'bgLine',
          type: 'lines',
          coordinateSystem: 'GLMap',
          zlevel: 1,
          lineStyle: {
            normal: {
              color: getColor,
              width: 2,
              opacity: 0.5,
              curveness: 0.2,
            },
          },
          data: lineData,
        },
        {
          name: 'scatter',
          type: 'effectScatter',
          coordinateSystem: 'GLMap',
          zlevel: 2,
          rippleEffect: {
            scale: 50,
            brushType: 'stroke',
          },
          label: {
            normal: {
              fontSize: 25,
              show: false,
              position: 'right',
              formatter: '{b}',
            },
          },
          symbolSize: 2,
          itemStyle: {
            normal: {
              show: true,
              color: getColor,
            },
          },
          data: scatterData,
        },
        {
          name: 'sLine',
          type: 'lines',
          coordinateSystem: 'GLMap',
          zlevel: 3,
          effect: {
            show: true,
            period: 6,
            trailLength: 0.4,
            symbolSize: 5,
          },
          lineStyle: {
            normal: {
              color: getColor,
              width: 1,
              curveness: 0.2,
            },
          },
          data: lineData,
        },
        {
          name: 'lLine',
          type: 'lines',
          coordinateSystem: 'GLMap',
          zlevel: 4,
          effect: {
            show: true,
            period: 6,
            trailLength: 0.4,
            opacity: 0.1,
            symbolSize: 20,
          },
          lineStyle: {
            normal: {
              color: getColor,
              width: 0,
              curveness: 0.2,
            },
          },
          data: lineData,
        },
      ]
    },
    getOption(series) {
      return {
        GLMap: {
          roam: true,
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0)',
          formatter: function (param) {
            return param.data.name + '->' + param.data.dest + ': ' + param.data.count
          },
        },
        series: series,
      }
    },
    removeMigraLayer() {
      // console.log('%c [ echartslayer ]-1070', 'font-size:13px; background:pink; color:#bf2c9f;', echartslayer)
      if (echartslayer && echartslayer.chartId) {
        echartslayer.remove()
        // echartslayer.dispose()
        echartslayer = []
        // console.log('%c [ echartslayer ]-1073', 'font-size:13px; background:pink; color:#bf2c9f;', echartslayer)
      }
      // if(echartslayer && echartslayer!=[]){
      // if(echartslayer && echartslayer!=[] && echartslayer.getChartId()){
      // echartslayer= []
      // }
      // if(echartslayer && echartslayer.getChartId()){
      //   echartslayer.remove();
      // }
    },
    // 热力图效果
    addHeatmap(map, value, data) {
      console.log('%c [ map, value, data ]-1223', 'font-size:13px; background:pink; color:#bf2c9f;', map, value, data)
      // this.removeDataSource(map, 'heatmapSource')
      this.removeMapLayer(map, 'heatmapLayer')
      if (value == true) {
        // 增加自定义数据源、自定义图层
        map.addSource('heatmapSource', {
          type: 'geojson',
          data: data /*可以是具体的服务*/,
        })
        map.addLayer({
          id: 'heatmapLayer',
          type: 'heatmap',
          source: 'heatmapSource',
          layout: {
            visibility: 'visible',
          },
          paint: {
            // 一个热力图数据点的模糊范围，单位是像素，默认值30；要求：值大于等于1，可根据zoom level进行插值设置
            'heatmap-radius': 30,
            //一个热力图单个数据点的热力程度，默认值为1；要求：值大于等于0，支持使用property中某个的热力值
            'heatmap-weight': {
              property: 'mag',
              stops: [
                [0, 0],
                [10, 1],
              ],
            },
            // 用于统一控制热力值的强度，默认值1；要求：值大于等于0，可根据zoom level进行插值设置
            'heatmap-intensity': 1,
            // 表示热力图颜色阶梯，阶梯的值域范围为0-1，默认值为["interpolate",["linear"],["heatmap-density"],0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"]
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(0, 0, 255, 0)',
              0.1,
              'royalblue',
              0.3,
              'cyan',
              0.5,
              'lime',
              0.7,
              'yellow',
              1,
              'red',
            ],
            // 表示热力图的不透明度，默认值1；值域范围0-1，可根据zoom level进行插值设置
            'heatmap-opacity': 1,
          },
        })
      }
    },
    // 路况和粒子流处理
    changeRoadLquid(map, value) {
      // 地图类型 18820
      // 背景图id 15872 ec95065d03939ca58cfd6db8d5bd549b  // 18820   651606b76f1dbf54a5aa3dff3c4d42c5
      if (map.getLayer('ec95065d03939ca58cfd6db8d5bd549b')) {
        if (value == true) {
          map.setLayoutProperty('ec95065d03939ca58cfd6db8d5bd549b', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('ec95065d03939ca58cfd6db8d5bd549b', 'visibility', 'none')
        }
      }
      if (map.getLayer('651606b76f1dbf54a5aa3dff3c4d42c5')) {
        if (value == true) {
          map.setLayoutProperty('651606b76f1dbf54a5aa3dff3c4d42c5', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('651606b76f1dbf54a5aa3dff3c4d42c5', 'visibility', 'none')
        }
      }

      // 背景图id 222547 8ffe42753ff74bf4db45a0487eaed52d  // 222548   0119617c3a55235ffca6baae618f4abc
      if (map.getLayer('8ffe42753ff74bf4db45a0487eaed52d')) {
        if (value == true) {
          map.setLayoutProperty('8ffe42753ff74bf4db45a0487eaed52d', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('8ffe42753ff74bf4db45a0487eaed52d', 'visibility', 'none')
        }
      }
      if (map.getLayer('0119617c3a55235ffca6baae618f4abc')) {
        if (value == true) {
          map.setLayoutProperty('0119617c3a55235ffca6baae618f4abc', 'visibility', 'visible')
        } else {
          map.setLayoutProperty('0119617c3a55235ffca6baae618f4abc', 'visibility', 'none')
        }
      }

      // 粒子流id  3606a43e8a46744be57eea1fbf80f2b0
      if (map.getLayer('3606a43e8a46744be57eea1fbf80f2b0')) {
        if (value == true) {
          map.setLayoutProperty('3606a43e8a46744be57eea1fbf80f2b0', 'visibility', 'none')
        } else {
          map.setLayoutProperty('3606a43e8a46744be57eea1fbf80f2b0', 'visibility', 'visible')
        }
      }

      // 返回原版 文字图层展示/隐藏 cityPointLayer
      if (map.getLayer('cityPointLayer')) {
        if (value == true) {
          map.setLayoutProperty('cityPointLayer', 'visibility', 'none')
        } else {
          map.setLayoutProperty('cityPointLayer', 'visibility', 'visible')
        }
      }
    },
    //添加不同层级图层
    addImageLayer(layerId, layerType, dataSourceName, imageName, st) {
      console.log('%c [ layerId, layerType, dataSourceName, imageName, st ]-1330', 'font-size:13px; background:pink; color:#bf2c9f;', layerId, layerType, dataSourceName, imageName, st)
      if (st == 'status') {
        this.baseMap.addLayer({
          id: layerId,
          type: layerType,
          source: dataSourceName,
          // "filter": this.onShowRedData(layerId,["==", "status", "21"]),
          layout: {
            'icon-allow-overlap': true,
            'icon-image': imageName + '-' + '{status}' + '.png',
            'icon-size': 1,
          },
        })
      }
      // 周边设备情况
      else if (st == 'area') {
        this.baseMap.addLayer({
          id: layerId,
          type: layerType,
          source: dataSourceName,
          layout: {
            'icon-allow-overlap': true,
            'icon-image': '{iconName}',
            'icon-size': 1,
          },
        })
      }
      // else if(st =='weather'){
      //   this.baseMap.addLayer({
      //     "id": layerId,
      //     "type": layerType,
      //     "source": dataSourceName,
      //     // "filter": this.onShowRedData(layerId,["==", "status", "21"]),
      //     "layout": {
      //       "icon-allow-overlap": true,
      //       "icon-image": "{iconName}",
      //       "icon-size": 1
      //     },
      //   });
      // }
      else {
        this.baseMap.addLayer({
          id: layerId,
          type: layerType,
          source: dataSourceName,
          // "filter": this.onShowRedData(layerId,["==", "status", "21"]),
          layout: {
            'icon-allow-overlap': true,
            'icon-image': imageName,
            'icon-size': 1,
          },
        })
      }
    },
    // 筛选图层不同status
    onShowRedData(layerId, filter) {
      if (this.baseMap) {
        if (this.baseMap.getLayer(layerId)) {
          this.baseMap.setFilter(layerId, filter)
        }
      }
    },

    //图层隐藏
    hideLayerByLayerId(map, layerId, show) {
      let display = 'none'
      if (show) {
        display = 'visible'
      }
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', display)
      }
    },

    // 聚合图层功能
    addPolymerizationLayer(layerId, layerType, dataSourceName, imageName) {
      this.removeMapLayer(this.baseMap, layerId)

      var _this = this
      //添加非聚合图层
      this.baseMap.addLayer({
        id: layerId,
        type: layerType,
        source: dataSourceName,
        filter: ['!has', 'point_count'],
        layout: {
          'icon-image': imageName,
          'icon-anchor': 'bottom',
        },
      })
      //添加聚合图层
      var layers = [
        [50, '#15bfe4'],
        [30, '#15bfe4'],
        [15, '#15bfe4'],
        [0, '#15bfe4'],
      ]
      layers.forEach(function (layer, i) {
        _this.baseMap.addLayer({
          id: 'cluster-' + i,
          source: dataSourceName,
          // "type": "circle",
          // "paint": {
          //     "circle-color": layer[1],
          //     "circle-radius": 46
          // },
          type: 'symbol',
          paint: {
            'text-color': '#ffffff', // 更改文字颜色
          },
          layout: {
            'icon-image': 'juhe.png', // 聚合图标
            'text-field': '{point_count}',
            'text-offset': [10, 5], // 更改文字偏移
            'text-anchor': 'top',
            'icon-anchor': 'bottom',
            'text-size': 4, // 文字大小
            'icon-allow-overlap': true, //图标允许压盖
            'text-allow-overlap': true, //图标覆盖文字允许压盖
          },
          filter:
            i === 0
              ? ['>=', 'point_count', layer[0]]
              : ['all', ['>=', 'point_count', layer[0]], ['<', 'point_count', layers[i - 1][0]]],
        })
      })
      //添加数量图层
      this.baseMap.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: dataSourceName,
        layout: {
          'text-field': '{point_count}',
          'text-size': 26,
          // "text-font": ["旁门正道标题体","Arial Unicode MS Regular"],
          'text-offset': [0, -3.25], // 更改文字偏移
          'icon-allow-overlap': true, //图标允许压盖
          'text-allow-overlap': true, //图标覆盖文字允许压盖
        },
        paint: {
          'text-color': '#fff',
        },
        filter: ['has', 'point_count'],
      })
    },
    // 绘制粒子流效果处理
    drawDynamicTraffic() {
      this.removeMapLayer(this.baseMap, 'road-cond-sprite-1')
      this.removeMapLayer(this.baseMap, 'road-cond-sprite-2')
      this.removeMapLayer(this.baseMap, 'road-cond-sprite-3')
      this.removeMapLayer(this.baseMap, 'road-cond-sprite-4')
      this.removeMapLayer(this.baseMap, 'road-cond-sprite-5')
      this.baseMap.repaint = true
      // 禁止通行粒子流图层
      this.baseMap.addLayer({
        id: 'road-cond-sprite-1',
        type: 'sprite',
        source: 'DynamicTraffic',
        'source-layer': 'link',
        layout: {
          'sprite-cap': 'round',
          visibility: 'visible',
          'sprite-join': 'round',
        },
        paint: {
          'sprite-speed': 1, // 最小值为1，最大值为2000
          'sprite-width': {
            stops: [
              [15, 2],
              [18, 3],
            ],
            base: 1,
          },
          //根据status属性之1，2，3，4进行分级渲染
          'sprite-color': '#999999',
        },
        filter: ['all', ['==', 'status', 0],[ "in", "kind", 2, 1 ]],
        minzoom: 15,
        maxzoom: 19.5,
      })
      // 流畅通行粒子流图层
      this.baseMap.addLayer({
        id: 'road-cond-sprite-2',
        type: 'sprite',
        source: 'DynamicTraffic',
        'source-layer': 'link',
        layout: {
          'sprite-cap': 'round',
          visibility: 'visible',
          'sprite-join': 'round',
        },
        paint: {
          'sprite-speed': 40, // 最小值为1，最大值为2000
          'sprite-width': {
            stops: [
              [15, 2],
              [18, 3],
            ],
            base: 1,
          },
          //根据status属性之1，2，3，4进行分级渲染
          'sprite-color': '#66cc00',
        },
        filter: ['all', ['==', 'status', 1],[ "in", "kind", 2, 1 ]],
        minzoom: 15,
        maxzoom: 19.5,
      })
      // 缓慢通行粒子流图层
      this.baseMap.addLayer({
        id: 'road-cond-sprite-3',
        type: 'sprite',
        source: 'DynamicTraffic',
        'source-layer': 'link',
        layout: {
          'sprite-cap': 'round',
          visibility: 'visible',
          'sprite-join': 'round',
        },
        paint: {
          'sprite-speed': 20, // 最小值为1，最大值为2000
          'sprite-width': {
            stops: [
              [15, 2],
              [18, 3],
            ],
            base: 1,
          },
          //根据status属性之1，2，3，4进行分级渲染
          'sprite-color': '#ff9900',
        },
        filter: ['all', ['==', 'status', 2],[ "in", "kind", 2, 1 ]],
        minzoom: 15,
        maxzoom: 19.5,
      })
      // 拥堵通行粒子流图层
      this.baseMap.addLayer({
        id: 'road-cond-sprite-4',
        type: 'sprite',
        source: 'DynamicTraffic',
        'source-layer': 'link',
        layout: {
          'sprite-cap': 'round',
          visibility: 'visible',
          'sprite-join': 'round',
        },
        paint: {
          'sprite-speed': 10, // 最小值为1，最大值为2000
          'sprite-width': {
            stops: [
              [15, 2],
              [18, 3],
            ],
            base: 1,
          },
          //根据status属性之1，2，3，4进行分级渲染
          'sprite-color': '#cc0000',
        },
        filter: ['all', ['==', 'status', 3],[ "in", "kind", 2, 1 ]],
        minzoom: 15,
        maxzoom: 19.5,
      })

      // 禁止通行粒子流图层
      this.baseMap.addLayer({
        id: 'road-cond-sprite-5',
        type: 'sprite',
        source: 'DynamicTraffic',
        'source-layer': 'link',
        layout: {
          'sprite-cap': 'round',
          visibility: 'visible',
          'sprite-join': 'round',
        },
        paint: {
          'sprite-speed': 5, // 最小值为1，最大值为2000
          'sprite-width': {
            stops: [
              [15, 2],
              [18, 3],
            ],
            base: 1,
          },
          //根据status属性之1，2，3，4进行分级渲染
          'sprite-color': '#9d0404',
        },
        filter: ['all', ['==', 'status', 4],[ "in", "kind", 2, 1 ]],
        minzoom: 15,
        maxzoom: 19.5,
      })
    },
    createPulsingPopup(map,itemVo) {
      let id = new Date().getTime()
      if (map) {
        if(itemVo.longitude == 0 || itemVo.latitude == 0){
          return;
        }
        //etc：门架/cpc：门架/mtc_in：收费站/mtc_out：收费站/cap：门架/server_area：服务区
        let type = "";
        switch (itemVo.passingType) {
          case "etc":
            type = "门架";
            break;
          case "cpc":
            type = "门架";
            break;
          case "mtc_in":
            type = "收费站";
            break;
          case "mtc_out":
            type = "收费站";
            break;
          case "cap":
            type = "门架";
            break;
          case "server_area":
            type = "服务区";
            break;
        }
        let divStr = ' <div class="eui-DdPop eui-DdPopSn" id="' + id + 'all" > \n';
        divStr += '<div class="head">'+itemVo.roadNo+'('+type+')</div> \n';
        divStr += '<div class="content">';
        divStr += ' <div class="info">';
        divStr += ' <p class="name">'+itemVo.passingName+'</p>';
        divStr += '</div>';
        divStr += '</div>';
        divStr += '</div>';
        var pop =  new minemap.Popup({
          closeOnClick: false,
          closeButton: false,
          anchor: 'bottom-left',
          offset: [0, 0]
        }).setLngLat([itemVo.longitude, itemVo.latitude]).setHTML(divStr).addTo(map);
        return pop
      }
    },
    //xxkj:地图画线
    addGcMapLineLayer(map, lineLayerId, sourceName, lineWidth, lineColor, lineType, isStops) {
      this.removeMapLayer(map, lineLayerId)
      if (!lineWidth) {
        lineWidth = 3
      }
      if (!lineColor) {
        lineColor = '#fe2a27'
      }
      //lineType存在时虚线
      var lineDasharray = [2]
      if (lineType) {
        lineDasharray = [2]
      }
      var lineWidthObj = lineWidth
      if (isStops) {
        lineWidthObj = {
          stops: [
            [7, 4],
            [10, 5],
            [12, 6],
            [15, 7],
          ],
          base: lineWidth,
        }
      }
      map.addLayer({
        id: lineLayerId,
        type: 'line',
        source: sourceName,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'border-visibility': 'visible', //是否开启线边框
        },
        paint: {
          'line-dasharray': lineDasharray,
          'line-color': {
            // 'type': 'categorical',
            type: 'interval', // 分段式
            property: 'startNum',
            stops: [
              [0, '#43CB29'],
              [10, '#7aff63'],
              [20, '#0B46F0'],
              [30, '#ff28cd'],
              [40, '#feff1c'],
              [50, '#13f5ff'],
              [60, '#f91300'],
              [70, '#15000e'],
              [80, '#d3f9ed'],
              [90, '#d3f9ed'],
              [100, '#d3f9ed'],
              [110, '#d3f9ed'],
            ],
            default: lineColor,
          },
          'line-width': 5,
          'line-border-width': 1, //设置线边框宽度
          'line-border-opacity': 1, //设置线边框透明度
          'line-border-color': '#ff1e1c', //设置线边框颜色
        },
        minzoom: 3,
        maxzoom: 17.5,
      })
    },

    //xxkj://点闪烁
    addGcPulsingSymbolLayer(map, layerId, pointJson) {
      let pulsingDot = this.createGcPulsingDot(map,'rgba(87,255,107,0.49)',280)
      if (!map.hasImage('pulsing-5')) {
        map.addImage('pulsing-5', pulsingDot, {
          pixelRatio: 2,
        })
      }
      let pulsingDot1= this.createGcPulsingDot(map,'rgba(87,255,107,0.49)',250)
      if (!map.hasImage('pulsing-4')) {
        map.addImage('pulsing-4', pulsingDot1, {
          pixelRatio: 2,
        })
      }
      let pulsingDot2= this.createGcPulsingDot(map,'rgba(87,255,107,0.49)',200)
      if (!map.hasImage('pulsing-3')) {
        map.addImage('pulsing-3', pulsingDot2, {
          pixelRatio: 2,
        })
      }
      let pulsingDot3= this.createGcPulsingDot(map,'rgba(87,255,107,0.49)',180)
      if (!map.hasImage('pulsing-2')) {
        map.addImage('pulsing-2', pulsingDot3, {
          pixelRatio: 2,
        })
      }
      let pulsingDot4= this.createGcPulsingDot(map,'rgba(87,255,107,0.49)',150)
      if (!map.hasImage('pulsing-1')) {
        map.addImage('pulsing-1', pulsingDot4, {
          pixelRatio: 2,
        })
      }
      this.addMapSourceGeojson(map, 'points', pointJson)
      map.addLayer({
        id: layerId,
        type: 'symbol',
        source: 'points',
        layout: {
          'icon-image': '{icon}',
          //是否允许图片压盖
          'icon-allow-overlap': true,
        },
      })
    },

    //xxkj: 绘制脉冲点
    createGcPulsingDot(map,color,size) {
      var size = size
      var pulsingDot = null
      pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // 在图层添加到地图时获取获取canvas context
        onAdd: function () {
          var canvas = document.createElement('canvas')
          canvas.width = this.width
          canvas.height = this.height
          this.context = canvas.getContext('2d')
        },

        // 每帧渲染时调用
        render: function () {
          var duration = 10000
          var t = (performance.now() % duration) / duration

          var radius = (size / 2) * 0.3
          var outerRadius = (size / 2) * 0.7 * t + radius
          var context = this.context

          // 画外围圆
          context.clearRect(0, 0, this.width, this.height)
          context.beginPath()
          context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
          context.fillStyle = 'rgba(240,239,255,0.03)'
          context.fill()

          // 画内圈圆
          context.beginPath()
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
          context.fillStyle = color
          context.strokeStyle = color
          context.lineWidth = 2 + 4 * (1 - t)
          context.fill()
          context.stroke()

          // 从canvas中更新图片数据
          this.data = context.getImageData(0, 0, this.width, this.height).data
          // 不断地重新绘制地图，导致平滑的动画点
          map.triggerRepaint()
          // 返回`true`让映射知道图像已经更新
          return true
        },
      }
      return pulsingDot
    },

    //xxkj:
    addGcMapPopupSpecial(map, equipName, content, coordinates, fColor,clickEventHandler) {
      var markerId = this.uuid()
      var el = document.createElement('div')
      el.id = markerId;
      el.addEventListener('click', this._onTitleClick);
      el.style.zIndex = popupIndex
      el.className = 'custom-popup-class MapPopupSpecial' //custom-popup-class为自定义的css类名
      /* var d1 = document.createElement('div')
       d1.className = 'custom-popup-title' //custom-popup-content为自定义的css类名
       d1.innerHTML = '<span>' + equipName + '</span>'
       el.appendChild(d1)*/
      var d2 = document.createElement('div')
      d2.className = 'custom-popup-content' //custom-popup-content为自定义的css类名
      if (fColor == '红色') {
        d2.innerHTML = '<div class="empty-border red"><span>' + content + '</span></div>'
      } else if (fColor == '黄色') {
        d2.innerHTML = '<div class="empty-border yellow"><span>' + content + '</span></div>'
      } else {
        d2.innerHTML = '<div class="empty-border"><span>' + content + '</span></div>'
      }
      el.appendChild(d2)
      var d3 = document.createElement('div')
      d3.className = 'custom-popup-tips' //custom-popup-tips为自定义的css类名
      el.appendChild(d3)
      var popup = new minemap.Popup({ closeOnClick: false, closeButton: false, anchor: 'bottom', offset: [0, 10] })
        .setLngLat(coordinates)
        .setDOMContent(el)
        .addTo(map)
      popup.addClassName('map-popup')
      return popup
    },

    //xxkj
    addGcMapPopup(map, content, coordinates) {
      var el = document.createElement('div')
      el.className = 'custom-popup-class' //custom-popup-class为自定义的css类名
      var d1 = document.createElement('div')
      el.className = 'custom-popup-content' //custom-popup-content为自定义的css类名
      d1.innerHTML = '<div class="empty-border"><span>' + content + '</span></div>'
      d1.style.color = 'white'
      el.appendChild(d1)
      var popup = new minemap.Popup({ closeOnClick: false, closeButton: false, anchor: 'bottom', offset: [0, -12] })
        .setLngLat(coordinates)
        .setDOMContent(el)
        .addTo(map)
      return popup
    },
  },
}
</script>

<style lang="less">
.minemap-popup{
  .minemap-popup-content{
    .eui-DdPop {
      z-index: 999;
  
      .head {
        display: flex;
        align-items: center;
        height: 34px;
        padding: 0 10px;
        font-size: 14px;
        color: #fefefe;
  
        img {
          margin-right: 5px;
        }
      }
  
      .content {
        padding: 5px 10px;
        background: #fff;
  
        &.contentFlex {
          display: flex;
          align-items: center;
  
          .photo {
            width: 40px;
            height: 40px;
            margin-right: 7px;
            overflow: hidden;
            cursor: pointer;
          }
  
          .info {
            flex: 1;
            flex-direction: column;
            align-items: flex-start;
          }
        }
  
        .info {
          display: flex;
          align-items: center;
          line-height: 20px;
  
          .name {
            font-size: 14px;
            color: #323232;
          }
  
          .unit {
            font-size: 14px;
  
            b {
              font-size: 20px;
              color: #323232;
            }
          }
        }
      }
  
      &.eui-DdPopyjwz {
        .head {
          background: linear-gradient(90deg, #b4e4dc 0%, #b4e4dc 100%);
          // background: url(~@/assets/images/icon-sxt2Bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      &.eui-DdPopjydw {
        .head {
          background: linear-gradient(90deg, #f7389f 0%, #f7389f 100%);
          // background: url(~@/assets/images/icon-sxt2Bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      &.eui-DdPopSfz {
        .head {
          background: linear-gradient(90deg, #f7ba00 0%, #ffd450 100%);
          // background: url(~@/assets/images/icon-sxt2Bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
  
      &.eui-DdPopSd {
        .head {
          background: linear-gradient(90deg, #30d6fa 0%, #00ccf1 100%);
          // background: url(~@/assets/images/icon-sd2Bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
  
      &.eui-DdPopQl {
        .head {
          background: linear-gradient(90deg, #4686f4 0%, #1a6eff 100%);
          // background: url(~@/assets/images/icon-sxt2Bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
  
      &.eui-DdPopSn {
        .head {
          background: linear-gradient(90deg, #75b43d 0%, #91d059 98%);
          // background: url(~@/assets/images/icon-snBg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
  
      &.eui-DdPopFwq {
        .head {
          background: linear-gradient(90deg, #0abf86 0%, #5dd1ad 100%);
          // background: url(~@/assets/images/icon-fwqBg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
  
      &.eui-DdPopSxt {
        .head {
          background: linear-gradient(90deg, #034cd4 0%, #001dcd 100%);
          // background: url(~@/assets/images/icon-sxt2Bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
  
      &.eui-DdPopQbb {
        .head {
          background: linear-gradient(90deg, #ff7800 0%, #ffac63 100%);
          // background: url(~@/assets/images/icon-qbb2Bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
    }

  }
}
</style>
