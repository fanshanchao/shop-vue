import base from './base' //导入家口域名列表
import axios from '../util/http' //导入自定义的axios实例


const seckill = {
	//获取秒杀列表 根据分页
	getSeckillList(param){
		return axios.get(base.lo+'seckill/list',{
			params:{
			page:param.page,
			pageSize:param.pageSize
		}
	})
	},
	//获取系统当前时间
	getSystemTime(){
		return axios.get(base.lo+'seckill/now')
	},
	//根据秒杀id获取当前秒杀信息
	getSeckillById(seckillId){
		return axios.get(base.lo+'seckill/'+seckillId+'/detail')
	},
	//获取秒杀地址
	getSeckillApi(seckillId){
		return axios.get(base.lo+'seckill/'+seckillId+'/exposer')
	},
	//执行一个秒杀
	submitSeckill(data){
		return axios.post(base.lo+'seckill/'+data.seckillId+'/'+data.md5+'/execution',data.params)
	},
	//创建一个秒杀
	addSeckill(data){
		return axios.post(base.lo+'seckill',data)
	}
}
export default seckill