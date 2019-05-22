//这个文件定义整体的vuex
//在这里组装 action.js getters.js mutation.js 模块里面的js
import Vue from 'vue'
import Vuex from 'vuex'
// import getters from './getters'
// import mutations from './mutations'
// import actions from './actions'
import user from './modules/user'
import permission from './modules/permission'
import carts from './modules/shoppingCart'
//全局注册vuex
Vue.use(Vuex)
//导出store对象
export default new Vuex.Store({
	modules:{
		user,
		permission,
		carts
	}
})