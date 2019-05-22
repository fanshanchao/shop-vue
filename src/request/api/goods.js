/**
商品的接口列表
*/
import base from './base' //导入家口域名列表
import axios from '../util/http' //导入自定义的axios实例
const goods = {
	getGoodsTypes(){
		return axios.get(base.lo+'goodsTypes')
	},
	//创建一个商品类别
	addGoodsType(param){
		return axios.post(base.lo+'goodsTypes',{typeName:param})
	},
	//添加一个商品
	addGoods(param){
		return axios.post(base.lo+'goods',param)
	},
	//根据分页去获取商品
	getGoods(param){
		return axios.get(base.lo+'goods',{
			params:{
				page:param.page,
				pageSize:param.pageSize
			}
		})
	},
	//根据分类和排序方式分页去获取商品
	getGoodsByType(param){
		return axios.get(base.lo+'goods',{
			params:{
				page:param.page,
				pageSize:param.pageSize,
				typeId:param.typeId,
				sortName:param.sortName
			}
		})
	},
	//更新一个商品
	updateGoods(param){
		return axios.put(base.lo+'goods/'+param.goodsId,{
			goodsName:param.goodsName,
			goodsDesc:param.goodsDesc,
			goodsPrice:param.goodsPrice,
			typeId:param.typeId,
			goodsRepertory:param.goodsRepertory,
			imageUrl:param.imageUrl
		})
	},
	//下架一个商品
	outGoods(param){
		return axios.put(base.lo+'outGoods/'+param)
	},
	//上架一个商品
	goGoods(param){
		return axios.put(base.lo+'goGoods/'+param)
	},
	//获取商品的数量
	getGoodsCount(){
		return axios.get(base.lo+'getGoodsCount')
	},
	//获取某个分类商品的数量
	getGoodsCountByType(param){
		return axios.get(base.lo+'getGoodsCount',{
			params:{
				typeId:param
			}
		})
	},
	//获取某个商品的信息
	getGoodsById(param){
		return axios.get(base.lo+'goods/'+param)
	},
	//从elasticsearch搜索包含某个关键字的商品
	searchGoods(params){
		return axios.post(base.goodsElastic+'_search',{
			"query":{
				"multi_match":{
					"query":params.searchValue,
					"fields":["goodsName","goodsDesc","typeName"]
				}
			},
			//从第几个元素开始 用于分页
			"from":params.pageStart,
			"size":params.pageSize,
			//排序的方式和排序的字段
			"sort":[params.sortValue]
		})
	}
}
export default goods