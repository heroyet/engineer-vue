/*
 * @Author: your name
 * @Date: 2021-05-20 09:55:24
 * @LastEditTime: 2021-05-20 10:43:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tocc-portal-web\src\module\mineMap\js\staticMethods.js
 */

/*划分区划边界的定位*/
function addSources(areaCode) {
  var center = this.baseMap.getCenter()
  var param = { areaCode: '350100' }
  resourceApi.getMapPoint(param).then(res => {
    console.log(res)
    //添加片区图层
    var jsonData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [res.data]
          }
        }
      ]
    }
    this.baseMap.addSource('fillSource', {
      type: 'geojson',
      data: jsonData
    })
    this.addLayers()
  })
}
