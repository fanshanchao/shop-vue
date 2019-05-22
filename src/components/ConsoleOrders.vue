<template>
  <div class="consoleOrder">
    <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
      		<span class="title">收货人信息：</span><span>{{ props.row.receiverName }}，{{props.row.mobile}}</span>
      		<br/><br/>
      		<span class="title">收货地址：</span><span>{{ props.row.address }}</span>
      		<br/><br/>
      		<span class="title">买家留言：</span><span>{{ props.row.message }}</span>
      		<br/><br/>
      		<span class="title">用户id：</span><span>{{ props.row.userId }}</span>
      		<br/>
      <el-table
      :data="props.row.resultOrderGoods"
      style="width: 100%">
      <el-table-column
        prop="goodsName"
        label="商品名称"
        >
      </el-table-column>
      <el-table-column
        prop="imageUrl"
        label="商品主图"
        >
        <template slot-scope="scope">
        	<img :src="base.image+scope.row.imageUrl">
        </template>
      </el-table-column>
      <el-table-column
        label="商品单价">
        <template slot-scope="scope">
        	{{scope.row.goodsPrice/scope.row.goodsNumber}}
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsNumber"
        label="商品数量">
      </el-table-column>
      <el-table-column
        prop="goodsPrice"
        label="商品总价">
      </el-table-column>
    </el-table>
    <br/>
    <div style="margin-left:77%">
    	<span class="title">订单总价：</span>
    	<span style="color:red;">￥{{ props.row.payMoney }}</span>	
    </div>
      </template>
    </el-table-column>
    <el-table-column
      label="订单id"
      prop="orderId"
      width="100px">
    </el-table-column>
    <el-table-column
      label="订单状态"
      width="100px">
      <template slot-scope="props">
      <span v-if="props.row.status ===0" style="color:#409EFF">
      	未付款
      </span>
      <span v-else-if="props.row.status ===1" style="color:#E6A23C">
      	未发货
      </span>
       <span v-else-if="props.row.status ===2" style="color:#080808">
      	已发货
      </span>
      <span v-else-if="props.row.status ===3" style="color:#67C23A;">
      	已完成
      </span>
      <s v-else-if="props.row.status ===4" style="color:#909399;">
      	已关闭
      </s>
      </template>
    </el-table-column>
     <el-table-column
      label="订单金额"
      width="100px">
      <template slot-scope="props">
      	{{ props.row.payMoney }}元
      </template>
    </el-table-column>
        <el-table-column
      label="创建时间"
      prop="createDate">
      <template slot-scope="props">
      	{{ dateFormat(props.row.createDate) }}
      </template>
    </el-table-column>
            <el-table-column
      label="付款时间">
       <template slot-scope="props">
      	{{ dateFormat(props.row.payDate) }}
      </template>
    </el-table-column>
        <el-table-column
      label="发货时间">
             <template slot-scope="props">
      	{{ dateFormat(props.row.deliveryDate) }}
      </template>
    </el-table-column>
     <el-table-column
      label="完成时间">
     <template slot-scope="props">
      	{{ dateFormat(props.row.confirmDate) }}
      </template>
    </el-table-column>
        <el-table-column label="操作">
      <template  slot-scope="scope">
        <el-button
          size="mini"
          v-if="isContainsPermission('order:update')&&scope.row.status===1"
          @click="handleEdit(scope.$index, scope.row.orderId)">发货</el-button>
        <el-button
          size="mini"
          type="danger"
          v-if="isContainsPermission('order:delete')&&scope.row.status!==3"
          @click="handleDelete(scope.$index, scope.row.orderId)">关闭订单</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
  background
  layout="prev, pager, next"
  :total="ordersCount"
  :page-size="pageSize"
  @current-change="goPage">
</el-pagination>
  </div>
</template>

<script>
import {isContainsMenu,isContainsPermission} from '../myUtil/permisssionUtil'
import { Message } from 'element-ui' //使用emlent的错误提示
//导入时间格式化工具
import {dateFormat} from '../myUtil/dateUtil'
//导入图片服务器地址
import base from '@/request/api/base'
export default {
  name: 'ConsoleOrder',
  data () {
    return {
           tableData: [],
           page:1,
           pageSize:5,
           ordersCount:0,
           base:base,
           //用来标识当前模式是不是处理订单模式
           isDeal:false
    }
  },
  created:function(){
  	//获取第一页的数据
  	this.getTableData(this.page)
  	//获取订单的数量
  	this.getOrderCount()
  },
  methods:{
  	//获取表格中的数据
  	getTableData(page){
      //判断当前模式 如果是处理模式就只获取未处理的订单
      if(this.isDeal){
        this.$api.order.getUnOrders({
          page:page,
          pageSize:this.pageSize
        }).then(res=>{
          this.tableData = res.data.data
        }).catch(error=>{
          this.errorTip('数据获取失败，联系管理员')
        })
      }else{
        //否则获取全部订单
        this.$api.order.getOrders({
          page:page,
          pageSize:this.pageSize
        }).then(res=>{
          this.tableData = res.data.data
        }).catch(error=>{
          this.errorTip('数据获取失败，联系管理员')
        })
      }
  	},
  	//跳转到某一页
  	goPage(val){
      this.page = val //将当前页数赋值给page
      //获取当前页的数据
      this.getTableData(this.page)
  	},
  	//获取订单的数量
  	getOrderCount(){
      //判断是不是处理订单模式 如果是 获取未处理订单的数量
      if(this.isDeal){
        this.$api.order.getUnOrderCount().then(res=>{
          this.ordersCount = res.data.data
        }).catch(error=>{
          this.errorTip("订单数量获取失败，联系管理员")
        })
      }else{
        this.$api.order.getOrderCount().then(res=>{
          this.ordersCount = res.data.data
        }).catch(error=>{
          this.errorTip("订单数量获取失败，联系管理员")
        })
      }
  	},
  	errorTip(msg){
        Message({
          message:msg,
          type:'error',
          duration:5*1000
        })
  	},
  	successTip(msg){
  	    Message({
          message:msg,
          type:'success',
          duration:3*1000
        })	
  	},
  	isContainsPermission:isContainsPermission,
  	dateFormat:dateFormat,
  	//关闭一个订单的方法
  	handleDelete(index,orderId){
  		this.$api.order.openOrder(orderId).then(res=>{
  			this.tableData[index].status = 4
  			this.successTip("成功")
  		}).catch(error=>{
  			this.errorTip('操作失败，请联系管理员')
  		})
  	},
  	//发货一个订单的函数
  	handleEdit(index,orderId){
  		this.$api.order.dealOrder(orderId).then(res=>{
  			this.tableData[index].status = 2
  			//设置当前时间为发货时间
  			this.tableData[index].deliveryDate = new Date()
  			this.successTip("成功发货")
  		}).catch(error=>{
  			this.errorTip('操作失败，请联系管理员')
  		})
  	}
  },
  //监听路由的变化 以便于多个路由使用同一个组件的时候不会使用同一个数据
  watch:{
    '$route'(to,from){
      if(to.fullPath==='/console/dealOrders'){
        this.isDeal = true
        //重新获取表格数据
        this.getTableData(1)
        this.getOrderCount()
      }else{
        this.isDeal = false
        this.getTableData(1)
        this.getOrderCount()
      }
    }
  }
}
</script>


<style scoped>
.title{
font-weight:bold;
}
img{
	width:50px;
	height:50px;
}
.el-pagination{
	margin-left:40%;
  	margin-top:3%;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
