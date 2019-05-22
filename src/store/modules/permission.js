//这个state存放着用户权限的信息
//导入权限的信息
import {constantRouterMap,asyncRouterMap} from '@/router/index' //导入异步加载的router

//这个方法用来判断用户的权限是否拥有这个路由
function hasPermission(roles,route){
	//判断路由中是否有meta字段 
	if(route.meta&&route.meta.role){
		//这个some函数用来判断 当前用户的角色是否符合这个路由所需要的权限
		//return roles.some(role=> route.meta.role.indexOf(role) >=0)
		//判断这个角色是否符合路由需要的权限
		return !(route.meta.role.indexOf(roles)>=0)
	}else{
		//默认代表这个用户具有这个权限
		return true
	}
}
//这个方法用来判断用户的权限是否拥有这个路由的子路由
function hasMenuPermission(permissionList,route){
	if(route.meta&&route.meta.hasPermission){
		//判断用户的权限list里面是否拥有这个权限 有就返回true
		return permissionList.indexOf(route.meta.hasPermission)>=0
	}else{
		return true
	}
}
//这个permiss保存了用户权限信息
const permission = {
	state:{
		routers:constantRouterMap,
		addRouters:[]
	},
	mutations:{
		//异步添加路由
		setRouters(state,routers){
			state.addRouters = routers;
			//console.log(constantRouterMap)
			//合并用户的路由
			//首先把之前最后一个404页面给删除掉 否则会导致后面的路由加载不上
			//constantRouterMap.pop()
			state.routers = constantRouterMap.concat(routers);
		},
		//删除动态加载的路由信息
		deleteDyRouters(state){
			state.addRouters = []
			state.routers = constantRouterMap
		}
	},
	actions:{
		//用来生成最终路由
		GenerateRoutes({commit},data){
			//返回一个异步执行的Promise
			return new Promise(rosolve=>{
				//获取传进来的角色信息
				const roles = data.roles+'';
				//获取传进来的权限信息
				const permissionList = data.permissionList
				//这个用户所有的权限信息
				const accessedRouters = asyncRouterMap.filter(v=>{
					//如果当前用户是超级管理员直接返回true
					if(roles.indexOf('超级管理员')>=0) return true;
					//去判断当前用户是否拥有当前路由的权限
					if(hasPermission(roles,v)){
						//判断是否有child路由
						if(v.children&&v.children.length>0){
							//如果有孩子路由 对孩子路由也进行权限判断
							v.children = v.children.filter(child=>{
								if(hasMenuPermission(permissionList,child)){
									return child;
								}
								return false;
							});
							// 如果符合权限要求直接返回v
							return v;
						}else{
							//没有孩子路由的情况也直接返回v
							return v;
						}
					}
					//返回false 表示这个路由不属于它 那么不会加载这个路由
					return false;
				});
				//过滤完用户需要的路由以后 就将路由设置到vuex中去
				commit('setRouters',accessedRouters);
				//console.log('生成最终路由')
				rosolve();
				//Promise.resolve();
			})
		},
		deleteDyRoutersAsyc({commit}){
			commit('deleteDyRouters')
		}
	},
	namespaced: true,
}
export default permission