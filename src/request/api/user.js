/*
*	user模块接口列表
*/
import base from './base' //导入家口域名列表
import axios from '../util/http' //导入自定义的axios实例
import qs from 'qs'//导入qs模块用于实例化post使用的数据  实际根本不用这个 用这个会导致服务端接受错误

const user = {
	//登陆
	userLogin(params){
		return axios.post(base.lo+'login',params);
	},
	//这个hello 用于测试
	userHello(){
		return axios.get(base.lo+'hello');
	},
	//用于判断登陆是否过期
	userRefresh(){
		return axios.get(base.lo+'refresh');
	},
	//使用邮箱获取验证码
	getVerCode(params){
		return axios.post(base.lo+'getCode',params);
	},
	//注册一个用户
	addUser(params){
		return axios.post(base.lo+'user',params);
	},
	//退出登陆
	userLogout(){
		return axios.get(base.lo+'logout');
	},
	//获取用户的权限信息
	userPermission(){
		return axios.get(base.lo+'getPermission');
	},
	//获取所有用户的信息
	getUsers(data){
		return axios.get(base.lo+'users',{
			params:{
				page:data.page,
				pageSize:data.pageSize
			}
		})
	},
	//获取整个商城用户的数量
	getUserCount(){
		return axios.get(base.lo+'userCount');
	},
	//锁住一个用户
	lockUser(params){
		return axios.get(base.lo+'lockUser/'+params)
	},
	unlockUser(params){
		return axios.get(base.lo+'unlockUser/'+params)
	}
}
export default user;