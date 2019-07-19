<template>
  <div class="addSeckill">
  	  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="商品 ID：">
            <span>{{ props.row.goodsId }}</span>
          </el-form-item>
          <el-form-item label="商品名称：">
          		<span>{{ props.row.goodsName }}</span>
          </el-form-item>
          <el-form-item label="商品描述：">
            <span>{{ props.row.goodsDesc }}</span>
          </el-form-item>
          <el-form-item label="商品价格：">
            <span>{{props.row.goodsPrice}}元</span>
          </el-form-item>        
          <el-form-item label="商品分类：">
            <span>{{ props.row.typeName }}</span>
          </el-form-item>
          <el-form-item label="商品库存：">
            <span>{{props.row.goodsRepertory}}</span>
          </el-form-item>
          <el-form-item label="商品销量：">
            <span>{{props.row.goodsSales}}</span>
          </el-form-item>
                    <el-form-item label="商品状态：">
            <span v-if="props.row.goodsStatus===0">未下架</span>
           	<span v-else style="color:red">已下架</span>
          </el-form-item>
                    <el-form-item label="商品主图：">
            <el-card>
            	<img :src="base.image+props.row.imageUrl" style="width:100px;height:100px;">
            </el-card>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="商品 ID"
      prop="goodsId">
    </el-table-column>
    <el-table-column
      label="商品名称"
      prop="goodsName">
    </el-table-column>
    <el-table-column
      label="描述"
      prop="goodsDesc">
    </el-table-column>
    <el-table-column v-if="isContainsPermission('goods:update')" label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleAddSeckill(scope.$index, scope.row)">添加秒杀</el-button>
      </template>
    </el-table-column>
  </el-table>
    <el-pagination
  background
  layout="prev, pager, next"
  :total="goodsCount"
  :page-size="pageSize"
  @current-change="goPage">
</el-pagination>
  <el-dialog
  v-if="isContainsPermission('goods:add')"
  title="添加秒杀"
  :visible.sync="dialogVisible"
  width="50%"
  :before-close="handleClose">
    	<el-row>
  		<el-col :span="10" :offset="6">
  <el-form ref="formData" :model="formData" label-width="80px" :rules="rules">
      <el-form-item label="秒杀库存" >
    <el-input-number v-model="formData.goodsRepertory"  :min="1" :max="100000" label="描述文字"></el-input-number>
  </el-form-item>
   <el-form-item label="秒杀价格">
    <el-input-number v-model="formData.goodsPrice" :precision="2" :step="1" :min="1.00" :max="1000"></el-input-number>
  </el-form-item>
  <el-form-item label="开始时间">
    <el-date-picker
      v-model="startTime"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </el-form-item>
    <el-form-item label="结束时间">
    <el-date-picker
      v-model="endTime"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </el-form-item>
   <el-form-item>
    <el-button type="primary" @click="onSubmit('formData')">提交修改</el-button>
    <el-button type="warning" @click="offDialog">取消</el-button>
  </el-form-item>
  </el-form>
  		</el-col>
  	</el-row>
</el-dialog>
  </div>
</template>

<script>
//导入判断权限工具
import {isContainsMenu,isContainsPermission} from '../myUtil/permisssionUtil'
import { Message } from 'element-ui' //使用emlent的错误提示
//导入图片服务器地址
import base from '@/request/api/base'
export default {
  name: 'addSeckill',
  data () {
    return {
      tableData: [],
      page:1,
      pageSize:5,
      base:base,
      dialogVisible:false,
      formData:{},
	  rules:{},
	  startTime:'',
	  endTime:'',
	  goodsCount:0,
    }
  },
  methods:{
  	isContainsPermission:isContainsPermission,
  	isContainsMenu:isContainsMenu,
  	getTableData(page){
	  //创建页面时去获取第一页的商品信息
	  	this.$api.goods.getGoods({
	  		page:page,
	  		pageSize:this.pageSize
	  	}).then(res=>{
	  		//将获取到的数据赋值给表格
	  		this.tableData = res.data.data
	  	}).catch(error=>{
	  		this.errorTip("数据获取失败，请联系管理员")
	  	})
  	},
  	errorTip(msg){
        Message({
          message:msg,
          type:'error',
          duration:5*1000
        })
  	},
  	//处理模态框关闭的函数
	handleClose(done) {
		this.$confirm('确认关闭？')
		  .then(_ => {
		    done();
		  })
		  .catch(_ => {});
	},
	//处理点击表格上的添加秒杀按钮 传进来当前在当前表格中的下标和当前行的object
	handleAddSeckill(index,object){
		this.dialogVisible = true;
		//注意这里不能简单的赋值  否则会导致两个组件绑定一个对象 一个更改两个会一起的更改
		this.formData = JSON.parse(JSON.stringify(object))
	},
      //关闭模态框调用的方法
    offDialog(){
      	this.dialogVisible = false;
      	this.formData={};
      },
	//获取商品数量的方法
	getGoodsCount(){
	  	this.$api.goods.getGoodsCount().then(res=>{
	  		this.goodsCount = res.data.data
	      console.log(this.goodsCount)
	  	})
	  },
	//跳转到当前页的方法
	goPage(val){
	  this.page = val //将当前页数赋值给page
	  //获取当前页的数据
	  this.getTableData(this.page)
	},
	//添加秒杀的方法
	onSubmit(formName){
	  	this.$refs[formName].validate((valid)=>{
	  	  if(valid){
	  	  	if(this.startTime.length===0||this.endTime.length===0){
	  	  		this.errorTip('请选择开始时间和结束时间！')
	  	  		return
	  	  	}else{
	  	  		console.log(this.formData.goodsId)
	  	  		this.$api.seckill.addSeckill({
	  	  			seckillId:-1,
	  	  			goodsId:this.formData.goodsId,
	  	  			seckillRepertory:this.formData.goodsRepertory,
	  	  			seckillPrice:this.formData.goodsPrice,
	  	  			createTime:this.startTime,
	  	  			startTime:this.startTime,
	  	  			endTime:this.endTime
	  	  		}).then(res=>{
	    			Message({
			      	message:'添加成功',
			      	type:'success',
			      	duration:5*1000
			    	})
			    	//关闭模态框
            		this.offDialog()
	  	  		}).catch(error=>{
	  	  			this.errorTip('添加失败，请联系管理员')
	  	  		})
	  	  	}
	      }else{
	      	this.errorTip('输入有误，请重新输入')
	     }
	   })
	}
  },
  created:function(){
  	//获取第一页数据
  	this.getTableData(this.page)
    //获取所有商品的数量
    this.getGoodsCount()
  }
}
</script>


<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  label {
    color: #99a9bf;
  }
  .demo-table-expand,.el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  span{
  	color:black;
  }
  .el-form-item{
  	margin-top:15px;
  }
  .el-pagination{
  	margin-left:40%;
  	margin-top:5%;
  }
</style>
