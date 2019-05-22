<template>
  <div class="goods">
  	<headComponent></headComponent>
    <serachComponent></serachComponent>
  	<el-row >
  		<el-col :span="6" :offset="4">
  			<div class="inforLeft"></div>
  			<img :src="base.image+goodsData.imageUrl">
  		</el-col>
  		<el-col :span="10" style="border-style:outset;border-width:0.5px;margin-left:30px;">
  			<div class="inforRight">
  				<h2>{{goodsData.goodsName}}</h2>
  			</div>
  			<div class="showPrice">
  				<p style="display:inline;">价格：<span style="color:red;font-size:20px;">￥{{goodsData.goodsPrice}}</span></p>
  				<p style="float:right;">累积销量：<span >{{goodsData.goodsSales}}</span></p>
  				<p>库存：<span style="color:#E6A23C;">{{goodsData.goodsRepertory}}</span></p>
  				<p>分类：<span style="color:black;">{{goodsData.typeName}}</span></p>
  			</div>
  			<div class="operation">
  			<el-input-number v-model="num" @change="handleChange" :min="1" :max="goodsData.goodsRepertory"></el-input-number>
  			<el-button type="danger">立即购买</el-button>
  			 <el-button type="primary">加入购物车</el-button>
  			</div>
  		</el-col>
  	</el-row>
  	<el-row >
  		<el-col  :span="16" :offset="4">
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="商品详情" name="first">{{goodsData.goodsDesc}}</el-tab-pane>
    <el-tab-pane label="评价管理" name="second">评价功能尚未开发~</el-tab-pane>
  </el-tabs>
  		</el-col>
  	</el-row>
  	<footerComponent></footerComponent>
  </div>
</template>

<script>
//导入head组件
import headComponent from './Head.vue' 
//导入footer组件
import footerComponent from './Footer.vue'
import { Message } from 'element-ui' //使用emlent的错误提示
//导入图片服务器地址
import base from '@/request/api/base'
//导入搜索栏
import serachComponent from './Serach.vue'
export default {
  name: 'Goods',
  data () {
    return {
    	goodsData:{},
    	base:base,
    	num:1,
      activeName:'first'
    }
  },
  components:{headComponent,footerComponent,serachComponent},
  created:function(){
  	//获取当前商品的数据
  	this.getData(this.$route.params.goodsId)
  },
  methods:{
  	getData(goodsId){
  		this.$api.goods.getGoodsById(goodsId).then(res=>{
  			this.goodsData = res.data.data
  		}).catch(error=>{
  			this.errorTip('数据获取失败 联系管理员')
  		})
  	},
  	errorTip(msg){
	  	Message({
	      message:msg,
	      type:'error',
	      duration:5*1000
	    })
  	},
  	handleChange(val){

  	},
    //点击商品详情和评价管理部分
    handleClick(tab, event){
       console.log(tab, event);
    }
  }
}
</script>


<style scoped>
img{
	width:100%;
	height:400px;
}
.el-col{
	height:400px;
}
.el-row{
	margin-top:20px;
}
.inforRight{
	padding-left:30px;
	text-align:center;
}
.inforLeft{
	
}
.showPrice{
	margin-left:6px;
	background-color:#F2F6FC;
	height:90px;
}
p{
	color:#909399;
	font-size:15px;
	margin:5px;
}
.operation{
	margin-top:140px;
	text-align:center;
}
</style>