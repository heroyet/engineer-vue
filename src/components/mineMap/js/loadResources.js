/*
 desc: 加载地图js、css
 @author: Fallen Dai
 @date: 2021/1/19
 */
import {mineMapService} from "@/components/mineMap/mineMapServiceConfig";

var Q = require('q');
// 接口url
const appDomainRoot = mineMapService['baseLayer_' + process.env.NODE_ENV].domainUrl;
const mapVersion = mineMapService['baseLayer_' + process.env.NODE_ENV].mapVer;

// 加载js
function asyncLoadJs(url) {
  return Q.Promise((resolve, reject) => {
    let srcArr = document.getElementsByTagName("script");
    let hasLoaded = false;
    for (let i = 0; i < srcArr.length; i++) {//判断当前js是否加载上
      hasLoaded = (srcArr[i].src == url) ? true : false;
    }
    if (hasLoaded) {
      resolve();
      return;
    }
    let script = document.createElement('script')
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
    script.onload = () => {
      resolve();
    }
    script.onerror = () => {
      reject();
    }
  })
}

// 加载css
export function loadCss(url) {
  let css = document.createElement('link');
  css.href = url;
  css.rel = 'stylesheet';
  css.type = 'text/css';
  document.head.appendChild(css);
}

export default function loadMineMapJs() {
  //加载css
  loadCss(appDomainRoot + mapVersion+"/minemap.css");
  loadCss(appDomainRoot + mapVersion+"/plugins/edit/minemap-edit.css");
  //加载js
  return Q.Promise((resolve, reject) => {
    asyncLoadJs(appDomainRoot +mapVersion+ "/minemap.js")
      .then(() => {
        return asyncLoadJs(appDomainRoot +mapVersion+ "/minemap-util.js")
      }).then(() => {
      return asyncLoadJs(appDomainRoot +mapVersion+ "/plugins/edit/minemap-edit.js")
    }).then(() => {
      return asyncLoadJs(appDomainRoot +mapVersion+ "/plugins/turf/turf.min.js")
    }).then(() => {
      return asyncLoadJs(appDomainRoot +mapVersion+ "/plugins/echarts/echarts.3.8.5.min.js")
    }).then(() => {
      return asyncLoadJs(appDomainRoot + "/minemapapi/v2.1.0/plugins/template/template.js")
      // return asyncLoadJs(appDomainRoot + "/minemapapi/minemap-plugins/template/template.js")
    }).then(() => {
        //图标轨迹 数据处理js
        // if(process.env.NODE_ENV == "production" || process.env.NODE_ENV == "pre"){
          //生产环境
          // http://35.80.162.24/minemapapi/v2.1.0/plugins/template/template.js
          // return asyncLoadJs(appDomainRoot + "minemapapi/v2.1.0/plugins/template/template.js")
        // }else{
          //互联网条件
          // return asyncLoadJs(appDomainRoot + "minemapapi/minemap-plugins/template/template.js")
        // }
    }).then(() => {
      resolve()
    }).catch(err => {
        reject(err)
      })
  })
}
