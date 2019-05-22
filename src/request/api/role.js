/**
角色的接口列表
*/
import base from './base' //导入家口域名列表
import axios from '../util/http' //导入自定义的axios实例
const role = {
	//获取所有角色的权限信息
	rolePermissions(){
		return axios.get(base.lo+'rolePermissions')
	},
	//更改某个用户的角色
	roleChange(data){
		return axios.put(base.lo+'roles/'+data.userId,{roleId:data.roleId})
	},
	//更改某个角色的权限信息
	updateRolePermission(param){
		return axios.put(base.lo+'rolePermissions/'+param.roleId,{roleName:param.roleName,permissionList:param.permissionList})
	},
	addRole(param){
		return axios.post(base.lo+'rolePermissions',param)
	}
}
export default role