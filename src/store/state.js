//定义全局的变量、数据
const state = {
    latitude:window.sessionStorage.getItem('latitude'),
    longitude:window.sessionStorage.getItem('longitude'),
    allShow:window.sessionStorage.getItem('allShow'),
};

export default state
