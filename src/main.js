// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
//引入element需要的文件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//直接导入路由文件就行了 不用全部写在main里面
import router from './router'
//引入axios
import api from './request/api/index'
//获取store 并且设置到全局对象中去
import store from './store/index'
//导入白名单路由列表
import {whiteList} from './router'
//导入图标库
import './assets/icon/iconfont'
Vue.config.devtools = true//运行debug程序

Vue.prototype.$api = api;//将api挂载道到vue的原型上
Vue.config.productionTip = false;
Vue.use(ElementUI);//还可以设置全局配置 组件的尺寸和弹框的初始值



//配置一个全局钩子函数
router.beforeEach((to,from,next)=>{
	//判断是否有token
	if(store.state.user.token){
		//每次跳转路由都要判断登陆是否过期
		//判断要去的路径是否是登陆页面 如果是不能去 因为已经拥有了token 登陆了 不能登陆
		// if(to.path ==='/login'){
		// 	next({path:'/'})
		// }else{
			//判断登陆是否过期
			api.user.userRefresh().then(res=>{
				  //如果已经登陆 则在data中标志当前用户已经登陆
				  if(res.data.code!==200){
				    //清除存在loaclstorage和vuex上的用户信息 并且清除路由信息
				    store.dispatch('user/deleteTokenAsync');
				   	store.dispatch('permission/deleteDyRoutersAsyc')
				   	//跳转到登陆页面
					next({
						path:'/login',
						query:{redirect:to.fullPath}//将要跳转的路由path作为参数，登陆成功后跳转到该路由
					}) 
				  }else{
				  	//登陆的情况下再动态获取路由
					//判断需要动态加载的路由是否为空 如果为空那么动态加载路由
					if(store.state.permission.addRouters.length===0){
							api.user.userPermission().then(res =>{
							//获取到用户的角色
							 const roles = res.data.data.roleName
							 //获取用户的权限信息
							 const menuList = res.data.data.menuList
							 const permissionList = res.data.data.permissionList
							 //进行动态添加路由
							 store.dispatch('permission/GenerateRoutes',{roles:roles,menuList:menuList,permissionList:permissionList}).then(()=>{
							 	//进行添加路由操作
							 	router.addRoutes(store.state.permission.addRouters)
							 	//hack方法 确保addRoutes已经完成
							 	next({...to,replace:true})
							 })
							 //将用户信息权限信息添加到user
							 store.dispatch('user/addPermissionAsync',res.data.data)
						})
					}else{
						//当用户有权限那么会直接进行
						next()
					}
				  }
			})
		//}
	}else{
		next()
		// 	//判断要去的路径是否在白名单内
		// if(whiteList.indexOf(to.path)!==-1){
		// //直接进入
		// next();
		// }else{
		// 	console.log('不再白名单')
		// 	next({
		// 		path:'/login',
		// 		query:{redirect:to.fullPath}//将要跳转的路由path作为参数，登陆成功后跳转到该路由
		// 	})
		// }
	}
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
