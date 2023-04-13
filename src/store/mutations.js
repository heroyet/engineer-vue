//全局改变state的方法
const mutations = {
    Latitude:(state,data)=>{
        state.latitude = data;
        window.sessionStorage.setItem('latitude',data)
    },
    Longitude:(state,data)=>{
        state.longitude = data;
        window.sessionStorage.setItem('longitude',data)
    },
    AllShow:(state,data)=>{
        state.allShow = data;
        window.sessionStorage.setItem('allShow',data)
    },
};
export default mutations
