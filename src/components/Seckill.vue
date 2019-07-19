<template>
  <div class="seckill">
  	<headComponent></headComponent>
	<el-row>
		<el-col :span="20" :offset="2">
	  	  <template>
	    <el-table
	      :data="seckillList"
	      style="width: 100%">
	      <el-table-column
	        prop="goods.goodsName"
	        label="商品名"
	        width="180">
	      </el-table-column>
	      <el-table-column
	        label="商品图片"
	        width="180">
	        <template slot-scope="scope">
	        <img :src="base.image+scope.row.goods.imageUrl">
     		 </template>
	      </el-table-column>
	      <el-table-column
	        label="秒杀开始时间"
	        width="180">
	        <template slot-scope="scope">
	        <span>{{dateFormat(scope.row.startTime)}}</span>
     		 </template>
	      </el-table-column>
	      <el-table-column
	        label="秒杀结束时间"
	        width="180">
	        <template slot-scope="scope">
	        <span>{{dateFormat(scope.row.endTime)}}</span>
     		 </template>     
	      </el-table-column>
	      <el-table-column
	        prop="seckillRepertory"
	        label="库存"
	        width="180">
	      </el-table-column>
	      <el-table-column
	        label="秒杀价格"
	        width="180">
	        <template slot-scope="scope">
	        	<p style="color:red;">￥<span style="font-size:20px;">{{scope.row.seckillPrice}}</span></p>
     		 </template>
	      </el-table-column>
	    <el-table-column label="操作">
	      <template slot-scope="scope">
	        <el-button
	          v-if = "systemTime > scope.row.endTime "
	          size="mini"
	          type="danger"
	          disabled>秒杀已结束</el-button>
	        <el-button
	          v-else
	          size="mini"
	          type="danger"
	          @click="handleSeckill(scope.$index, scope.row)">立即抢购</el-button>
	      </template>
	    </el-table-column>
	    </el-table>
	  </template>
		</el-col>
	</el-row>
	<footerComponent style="margin-top:130px;"></footerComponent>
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
//导入时间格式化工具
import {dateFormat} from '../myUtil/dateUtil'
export default {
  name: 'seckill',
  data () {
    return {
      seckillList:[],
      page:1,
      pageSize:10,
      base:base,
      systemTime:0
    }
  },
  created:function(){
  	this.getSeckillList()
  	this.getSystemTime()
  },
  methods:{
  	//获取秒杀列表的方法
  	getSeckillList(){
  		this.$api.seckill.getSeckillList({
  			page:this.page,
  			pageSize:this.pageSize
  		}).then(res=>{
  			this.seckillList = res.data.data
  		}).catch(errpr=>{
	  		Message({
		      message:'秒杀列表获取失败，请联系管理员',
		      type:'error',
		      duration:5*1000
		    })
  		})
  	},
  	//获取系统时间
  	getSystemTime(){
  		this.$api.seckill.getSystemTime().then(res=>{
  			this.systemTime = res.data.data
  		}).catch(error=>{
	  		Message({
		      message:'获取系统时间失败，请联系管理员',
		      type:'error',
		      duration:5*1000
		    })
  		})
  	},
  	//跳转秒杀详情页的方法
  	handleSeckill(idnex,row){
  		//先判断是否登陆了
  		this.$api.user.userRefresh().then(res=>{
  			if(res.data.code===424){
  				//没有登陆则跳转到登陆页面
  				this.$router.push({path:'login',query:{redirect:'seckill/'+row.seckillId}})
  			}else{
  				this.$router.push('seckill/'+row.seckillId)
  			}
  		})
  	},
  	dateFormat:dateFormat
  },
  components:{headComponent,footerComponent},
}
</script>


<style scoped>
.el-row{
	margin-top:30px;
}
img{
	width:50px;
	height:50px;
}
</style>
