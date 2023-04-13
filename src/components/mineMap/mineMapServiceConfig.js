/*
 *
 *  Copyright (c) 2005, 2020, EVECOM Technology Co.,Ltd. All rights
 * reserved.
 *  EVECOM PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 * /
 */

const baseUrl = process.env.VUE_APP_MINE_MAP_SERVER;
const mapVer = process.env.VUE_APP_MINE_MAP_SERVER_VER;
/**
 * MineMap地图服务配置
 */
export const mineMapService = {
  /*********************地图 js*********************************/
  baseLayerJs: baseUrl + 'minemap.js',
  //地图基础样式（信息窗体、打点等）
  baseLayerCss: baseUrl + 'minemap.css',
  // templateJs: baseUrl + '/plugins/template/template.js',
  // templateJs: baseUrl + '/minemapapi/v2.0.0/plugins/template/template.js',
  //用于判断关系的JS
  minemapUtilJs: baseUrl + 'minemap-util.js',
  miniemapEditJs: baseUrl + 'plugins/edit/minemap-edit.js',
  minemapEditCss: baseUrl + 'plugins/edit/minemap-edit.css',
  //开发配置
  baseLayer_development: {
    domainUrl: baseUrl,
    mapVer: mapVer,
    dataDomainUrl:[
      'https://datahive.minedata.cn',
      'https://datahive01.minedata.cn',
      'https://datahive02.minedata.cn',
      'https://datahive03.minedata.cn',
      'https://datahive04.minedata.cn'
    ],
    spriteUrl: baseUrl + mapVer + '/sprite/sprite',
    serviceUrl: 'https://mineservice.minedata.cn/service/',
    appKey: '16be596e00c44c86bb1569cb53424dc9',
    //--------------普通底图--------------
    solution: 19293,
    //路况地址
    trafficUrl: 'https://mineservice.minedata.cn/service/solu/style/id/19293',
    mineMapStyle: 'https://mineservice.minedata.cn/service/solu/style/id/19293',
    //--------------卫星地图---------------
    solution2: 19293,
    //路况地址
    trafficUrl2: 'https://mineservice.minedata.cn/service/solu/style/id/19293',
    mineMapStyle2: 'https://mineservice.minedata.cn/service/solu/style/id/19293',
    //--------------路网，深色地图---------------
    solution3: 19293,
    //路况地址
    trafficUrl3: 'https://mineservice.minedata.cn/service/solu/style/id/19293',
    mineMapStyle3: 'https://mineservice.minedata.cn/service/solu/style/id/19293',
  },
  baseLayer_pre: {
    domainUrl: baseUrl,
    mapVer: mapVer,
    dataDomainUrl: [
      baseUrl
    ],
    spriteUrl: baseUrl + mapVer + '/sprite/sprite',
    serviceUrl: baseUrl + '/service/',
    appKey: 'ca78282dfff148e3be5390ce027068f5',
    solution: 19293,
    //路况地址
    trafficUrl: baseUrl+'/service/solu/style/id/19293',
    mineMapStyle: baseUrl+'/service/solu/style/id/19293',

    //--------------卫星影像地图---------------
    solution2: 19293,
    // solution2: 222543,
    // solution2: 222555,
    //路况地址
    trafficUrl2: baseUrl+'/service/solu/style/id/19293',
    mineMapStyle2: baseUrl+'/service/solu/style/id/19293',
    // mineMapStyle2: baseUrl+'/service/solu/style/id/222543',
    //--------------路网，深色地图---------------
    //路况地址
    // solution3: 222562,
    // trafficUrl3: baseUrl+'/service/solu/style/id/222562',
    // mineMapStyle3: baseUrl+'/service/solu/style/id/222562',
    // solution3: 222562,
    //vmana颜色改过路况地址
    solution3: 19293,
    trafficUrl3: baseUrl+'/service/solu/style/id/19293',
    mineMapStyle3: baseUrl+'/service/solu/style/id/19293',
  },
  baseLayer_test: {
    domainUrl: baseUrl,
    mapVer: mapVer,
    dataDomainUrl:[
      'https://datahive.minedata.cn',
      'https://datahive01.minedata.cn',
      'https://datahive02.minedata.cn',
      'https://datahive03.minedata.cn',
      'https://datahive04.minedata.cn'
    ],
    spriteUrl: baseUrl + mapVer + '/sprite/sprite',
    serviceUrl: 'https://minedata.com.cn/service/',
    // 公司请求
    appKey: '61d5629cb2a14bab99f3cc08f78de01b',
    // 互联网请求
    // appKey: '16be596e00c44c86bb1569cb53424dc9',
    solution: 19293,
    //路况地址
    trafficUrl: 'https://minedata.com.cn/service/solu/style/id/19293',
    mineMapStyle: 'https://minedata.com.cn/service/solu/style/id/19293',

    //--------------卫星地图---------------
    solution2: 19293,
    //路况地址
    trafficUrl2: 'https://minedata.com.cn/service/solu/style/id/19293',
    mineMapStyle2: 'https://minedata.com.cn/service/solu/style/id/19293',
    //--------------路网，深色地图---------------
    solution3: 19293,
    //路况地址
    trafficUrl3: 'https://minedata.com.cn/service/solu/style/id/19293',
    mineMapStyle3: 'https://minedata.com.cn/service/solu/style/id/19293',
  },
}
