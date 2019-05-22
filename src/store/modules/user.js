 //这个是user 在vuex中的js文件 定义了user的state getters action mutations
//定义state
const state = {
	// userPermission:{
	// 	userId:window.localStorage.getItem("userId")||-1,
	// 	nickName:window.localStorage.getItem("nickName")||'',
	// 	roleId:window.localStorage.getItem("roleId")||-1,
	// 	roleName:window.localStorage.getItem("roleName")||'',
	// 	menuList:window.localStorage.getItem("menuList")||[],
	// 	permissionList:window.localStorage.getItem("permissionList")||[]
	// },
	userPermission:{},
	token:window.localStorage.getItem('token')||''
	//userRouters:window.localStorage.getItem("userRouters")||[]
}
//定义getters
const getters = {
	getToken(state){
		return state.token
	},
	getUserId(state){
		return state.userPermission.userId
	},
	getUserNickName(state){
		return state.userPermission.nickName
	},
	//返回这个用户的角色名 
	getRoleName(state){
		return state.userPermission.roleName
	},
	getUserPermission(state){
		return state.userPermission
	}
	// //返回这个用户动态加载的路由
	// getRouters(state){
	// 	return state.userRouters
	// }
}
//定义action 注意这里不能用mutations 因为mutation不能异步执行 而增加更新token的操作一般都是在发送了axios操作之后
//这里之前有个疑问就是state不是const定义的为什么还能改变呢？原来const指向的是一个对象 只保证了这个指针是const 而对象的属性是可以随便改变的
const actions = {
	//这里异步执行调用mutations  并且利用了参数结构
	addTokenAsync({commit},token){
		commit('addToken',token)
	},addPermissionAsync({commit},data){
		commit('addPermission',data)
	},
	//和上面类似
	deleteTokenAsync({commit}){
		commit('deleteToken')
	}
	// //和上面类型
	// addRoutersAsync({commit},data){
	// 	commit('addRouters',data)
	// }
}
const mutations = {
	//此处的事件为上方的action中commit提交的事件 将后台返回的所有数据存在vuex中去
	addToken(state,data){
		window.localStorage.setItem('token',data)
		state.token = data
		//console.log(window.localStorage.getItem('token'))
		// //用户权限信息的添加
		// window.localStorage.setItem('userId',data.data.userId)
		// state.userPermission.userId = data.data.userId
		// window.localStorage.setItem('nickName',data.data.nickName)
		// state.userPermission.nickName = data.data.nickName
		// window.localStorage.setItem('roleId',data.data.roleId)
		// state.userPermission.roleId = data.data.roleId
		// window.localStorage.setItem('roleName',data.data.roleName)
		// state.userPermission.roleName = data.data.roleName
		// window.localStorage.setItem('menuList',data.data.menuList)
		// state.userPermission.menuList = data.data.menuList
		// window.localStorage.setItem('permissionList',data.data.permissionList)
		// state.userPermission.permissionList = data.data.permissionList		
	},
	//删除token  顺便把用户信息也删除了 
	deleteToken(state){
		window.localStorage.removeItem('token')
		state.token=''
		state.userPermission = {}
		// window.localStorage.removeItem('userPermission')
		// window.localStorage.removeItem('userId')
		// window.localStorage.removeItem('nickName')
		// window.localStorage.removeItem('roleId')
		// window.localStorage.removeItem('roleName')
		// window.localStorage.removeItem('menuList')
		// window.localStorage.removeItem('permissionList')
		// window.localStorage.removeItem('userRouters')
	},
	addPermission(state,data){
		state.userPermission = data
	}
	//添加路由
	// addRouters(state,data){
	// 	window.localStorage.setItem('userRouters',data)
	// 	state.userRouters = data
	// }
}
//导出
export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}