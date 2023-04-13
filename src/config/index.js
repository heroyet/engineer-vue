/** init domain config */
import Vue from 'vue'
//设置全局API_BASE_URL
Vue.prototype.API_BASE_URL = process.env.VUE_APP_API_BASE_URL
Vue.prototype.API_HSRN_URL = process.env.VUE_APP_API_HSRN_URL
Vue.prototype.VUE_APP_HOME_VMANA_URL = process.env.VUE_APP_HOME_VMANA_URL
Vue.prototype.API_HWDPEVENT_URL = process.env.VUE_APP_API_HWDPEVENT_URL
Vue.prototype.FIRST_HWDPREP_URL = process.env.VUE_APP_API_HWDPREP_URL
Vue.prototype.FIRST_HWDP_URL = process.env.VUE_APP_FIRST_HWDP_URL
Vue.prototype.WEB_SOCKET_URL = process.env.VUE_APP_WEB_SOCKET_URL
Vue.prototype.HOME_URL = process.env.VUE_APP_HOME_URL
window._CONFIG['domianURL'] = Vue.prototype.API_BASE_URL
window._CONFIG['socketURL'] = Vue.prototype.WEB_SOCKET_URL
window._CONFIG['hsrnURL'] = Vue.prototype.API_HSRN_URL
window._CONFIG['vmanaURL'] = Vue.prototype.VUE_APP_HOME_VMANA_URL
window._CONFIG['hwdprepURL'] = Vue.prototype.FIRST_HWDPREP_URL
window._CONFIG['hwdpeventURL'] = Vue.prototype.API_HWDPEVENT_URL
window._CONFIG['firstHwdpUrl'] = Vue.prototype.FIRST_HWDP_URL

//工程建设接口
Vue.prototype.API_GCJS_URL = process.env.VUE_APP_API_GCJS_URL
window._CONFIG['ggjsURL'] = Vue.prototype.API_GCJS_URL
//xxkj:工程视频取流接口
Vue.prototype.API_RTSP_URL = process.env.VUE_APP_API_RTSP_URL
window._CONFIG['gcrtspURL'] = Vue.prototype.API_RTSP_URL
//xxkj:视频直播流
Vue.prototype.API_VIDEO_URL = process.env.VUE_APP_API_VIDEO_URL
window._CONFIG['gcvideoURL'] = Vue.prototype.API_VIDEO_URL
Vue.prototype.VUE_APP_API_DYJY_URL = process.env.VUE_APP_API_DYJY_URL
window._CONFIG['dyjyURl'] = Vue.prototype.VUE_APP_API_DYJY_URL
Vue.prototype.VUE_APP_API_FLOW_URL = process.env.VUE_APP_API_FLOW_URL
window._CONFIG['flowURl'] = Vue.prototype.VUE_APP_API_FLOW_URL

//单点登录地址
window._CONFIG['casPrefixUrl'] = process.env.VUE_APP_CAS_BASE_URL
window._CONFIG['onlinePreviewDomainURL'] =  process.env.VUE_APP_ONLINE_BASE_URL
window._CONFIG['staticDomainURL'] = Vue.prototype.API_BASE_URL + '/sys/common/static'
window._CONFIG['pdfDomainURL'] = Vue.prototype.API_BASE_URL+ '/sys/common/pdf/pdfPreviewIframe'