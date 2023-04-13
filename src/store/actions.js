//全局方法
const actions  ={
    Latitude({commit},data){
        commit('Latitude',data)
    },
    Longitude({commit},data){
        commit('Longitude',data)
    },
    AllShow({commit},data){
        commit('AllShow',data)
    }
};
export default actions
