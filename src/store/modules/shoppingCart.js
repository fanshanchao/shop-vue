//购物车管理的store


//定义state
const state = {
	carts:[],
	payCarts:[]//保存了需要支付的商品信息
}
//定义getters
const getters = {
	//获取购物车所有商品
	getCarts(state){
		return state.carts
	},
	//获取购物车的数量 默认最大数量不能超过20
	getCartsLength(state){
		return state.carts.length
	},
	//获取需要支付的商品信息
	getPayCarts(state){
		return state.payCarts
	}
}
//定义mutations
const mutations = {
	//添加一个商品到购物车
	addGoods(state,goods){
		//循环遍历购物车 查看是否有这个商品 如果有将数量+1 没有就添加到购物车
		let isHas = state.carts.some(item=>{
			//只有有一个为true 那么就返回true some函数只要有一个返回true就不会继续迭代下去
			if(item.goodsId===goods.goodsId){
				item.num += goods.num;
				item.summary =item.summary*item.num;
				return true;
			}else{
				return false;
			}
		})
		//如果购物车中没有这个商品 那么就添加进去
		if(!isHas){
			state.carts.push(goods)
		}
	},
	//修改购物车某个商品的数量 num为需要修改的数量
	updateGoods(state,data){
		state.carts.some(item=>{
			//只有有一个为true 那么就返回true some函数只要有一个返回true就不会继续迭代下去
			if(item.goodsId===data.goodsId){
				item.num = data.num
				let a = item.goodsPrice*item.num
				item.summary = a
				return true;
			}else{
				return false;
			}	
		})
	},
	//删除一个或一些商品 nums是需要删除的商品id数组
	deleteGoods(state,nums){
		for(let i = 0;i < state.carts.length;i++){
			//如果当前商品的id在需要删除的id数组中 那么删除这个商品
			if(nums.indexOf(state.carts[i].goodsId)>=0){
				state.carts.splice(i,1)
			}
		}
	},
	//清空购物车
	clearCarts(state){
		state.carts = []
	},
	//添加需要支付的商品到vuex中
	addPayCarts(state,data){
		state.payCarts = data
	},
	//清空需要支付的商品
	clearAddPayCarts(state){
		state.payCarts = []
	}
}
//定义action 异步执行
const actions = {
	//异步添加商品到购物车
	addGoodsAsync({commit},goods){
		return commit('addGoods',goods)
	},
	//异步更新一个商品的数量
	updateGoodsAsync({commit},goods){
		commit('updateGoods',goods)
	},
	//异步删除一个或一些商品 nums是需要删除的商品id数组
	deleteGoodsAsync({commit},nums){
		commit('deleteGoods',nums)
	},
	//异步清空购物车
	clearCartsAsync({commit}){
		commit('clearCarts')
	},
	//异步添加需要支付的商品到订单
	addPayCartsAsync({commit},data){
		commit('addPayCarts',data)
	},
	//异步清空需要支付的商品列表
	clearAddPayCartsAsync({commit}){
		commit('clearAddPayCarts')
	}
}
export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}