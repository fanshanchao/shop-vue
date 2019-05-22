//导入vuex
import store from '@/store/index' //引入store

//判断用户是否拥有此菜单或者此权限
export function isContainsMenu(param){
	//判断是否拥有此菜单 
	if(store.state.user.userPermission.menuList.indexOf(param)>=0){
		return true
	}else{
		return false
	}
}
//判断用户是否拥有此权限
export function isContainsPermission(param){
	if(store.state.user.userPermission.permissionList.indexOf(param)>=0){
		return true
	}else{
		return false
	}
}
