import base from './base' //导入家口域名列表
import axios from '../util/http' //导入自定义的axios实例

//订单的接口文件
const order = {
	//获取某一页的订单
	getOrders(param){
		return axios.get(base.lo+'orders',{
			params:{
				page:param.page,
				pageSize:param.pageSize
			}
		})
	},
	//获取订单的总数量
	getOrderCount(){
		return axios.get(base.lo+'getOrderCount')
	},
	//关闭一个订单
	openOrder(param){
		return axios.put(base.lo+'openOrders/'+param)
	},
	//发货一个订单
	dealOrder(param){
		return axios.put(base.lo+'dealOrders/'+param)
	},
	//获取某一页的未处理订单
	getUnOrders(param){
		return axios.get(base.lo+'unOrders',{
			params:{
				page:param.page,
				pageSize:param.pageSize
			}
		})
	},
	//获取未处理订单数量
	getUnOrderCount(){
		return axios.get(base.lo+'getUnOrderCount')
	},
	//提交一个订单
	submitOrder(data){
		return axios.post(base.lo+'orders',data)
	},
	//获取订单的状态
	getStatus(orderId){
		return axios.get(base.lo+'orderStatus/'+orderId)
	},
	//返回订单的价格
	getMoney(orderId){
		return axios.get(base.lo+'orderMoney/'+orderId)
	},
	//支付一个订单
	payOrder(orderId){
		return axios.post(base.lo+'payOrders/'+orderId)
	},
	//根据分页获取用户某种类型的全部订单
	getUserOrders(param){
		return axios.get(base.lo+'userOrders',{
			params:{
				page:param.page,
				pageSize:param.pageSize,
				status:param.status
			}
		})
	},
	//获取当前订单类型的数量
	getUserOrdersCount(param){
		return axios.get(base.lo+'userOrderCount',{
			params:{
				status:param
			}
		})
	},
	//取消一个订单
	cancelOrders(orderId){
		return axios.put(base.lo+'cancelOrders/'+orderId)
	}
}
export default order