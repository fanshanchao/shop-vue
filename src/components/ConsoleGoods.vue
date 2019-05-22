<template>
  <div class="consoleGoods">
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
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleGoods(scope.$index,scope.row.goodsStatus,scope.row.goodsId)">
          <span v-if="scope.row.goodsStatus===0">下架商品</span>
          <span v-else >重新上架</span>
      </el-button>
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
  v-if="isContainsPermission('goods:update')"
  title="编辑商品"
  :visible.sync="dialogVisible"
  width="50%"
  :before-close="handleClose">
    	<el-row>
  		<el-col :span="10" :offset="6">
  			  <el-form ref="formData" :model="formData" label-width="80px" :rules="rules">
  <el-form-item label="商品标题" prop="goodsName">
    <el-input type="textarea" v-model="formData.goodsName"></el-input>
  </el-form-item>
   <el-form-item label="商品描述" prop="goodsDesc">
    <el-input type="textarea" v-model="formData.goodsDesc"></el-input>
  </el-form-item>
      <el-form-item label="商品库存" >
    <el-input-number v-model="formData.goodsRepertory"  :min="1" :max="100000" label="描述文字"></el-input-number>
  </el-form-item>
   <el-form-item label="商品价格">
    <el-input-number v-model="formData.goodsPrice" :precision="2" :step="1" :min="1.00" :max="1000"></el-input-number>
  </el-form-item>
     <el-form-item label="商品分类">
   <el-select v-model="formData.typeName"  placeholder="请选择">
    <el-option
      v-for="item in goodsTypes"
      :key="item.typeId"
      :label="item.typeName"
      :value="item.typeName">
    </el-option>
  </el-select>
   <el-button  @click="addType">创建分类</el-button>
  </el-form-item>
   <el-form-item label="商品主图">
	            <el-card>
        	<img :src="base.image+formData.imageUrl" style="width:100px;height:100px;">
        </el-card>
 <el-upload
  class="avatar-uploader"
  :headers="uploadHeader"
  :action="uploadAddress"
  :show-file-list="true"
  :limit="1"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload"
  :auto-upload="true"
  >
  <el-button slot="trigger" size="small" type="success">更换图片</el-button>
  <div slot="tip" class="el-upload__tip">只能上传一张jpg文件，且不超过2M</div>
</el-upload>
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
import {mapGetters} from 'vuex';//获取token 以便于用于文件上传
export default {
  name: 'ConsoleGoods',
  data() {
    return {
      tableData: [],
        //是否修改
      isUpdate:false,
      page:1,
      pageSize:5,
      base:base,
      dialogVisible:false,
      formData:{},
      goodsTypes:[],
      uploadAddress:base.lo+'uploadGoodsImage',//文件上传地址
      uploadHeader:{
      	Authorization:''
      },
      goodsCount:0,
	  rules:{
		goodsName:[
		{required:true,message:'请输入商品名',trigger:'blur'},
			{min:5,max:100,message:'商品名在5~100字',trigger:'blur'},
			{ pattern: /^\S+$/, message: '不允许有空格', trigger: 'blur' }],
		goodsDesc:[
		    		{required:true,message:'请输入商品描述',trigger:'blur'},
			{min:10,max:200,message:'描述在10~200字',trigger:'blur'},
			{ pattern: /^\S+$/, message: '不允许有空格', trigger: 'blur' }
		]}
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
  	getGoodsTypes(){
  		this.$api.goods.getGoodsTypes().then(res=>{
  			this.goodsTypes = res.data.data
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
	//处理点击表格上的编辑按钮的函数 传进来当前在当前表格中的下标和当前行的object
	handleEdit(index,object){
		this.dialogVisible = true;
		//注意这里不能简单的赋值  否则会导致两个组件绑定一个对象 一个更改两个会一起的更改
		this.formData = JSON.parse(JSON.stringify(object))
	},
	//创建分类的函数
      addType(){
      	        this.$prompt('请输入分类名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\S{1,10}$/,
          inputErrorMessage: '不符合长度或格式错误'
        }).then(({ value }) => {
        	//发送axios请求去创建一个分类
        	this.$api.goods.addGoodsType(value).then(res=>{
        		if(res.data.code!==200){
        			this.errorTip(res.data.msg)
        		}else{
        			//重新去获取一下选择分类框的值
        			this.getGoodsTypes()
        			Message({
			      	message:'创建成功',
			      	type:'success',
			      	duration:5*1000
			    	})
        		}
        	})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },
  	  //上传文件成功后的回调函数
  	  handleAvatarSuccess(res, file) {
        //this.imageUrl = URL.createObjectURL(file.raw);
        //上传成功后将后台返回的url保存起来 以便于提交表单时使用
        if(res.code!==200){
        	errorTip(res.data.msg)
       }else{
         this.formData.imageUrl = res.data
       }
     },
      //在文件上传前的回调函数
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.errorTip('上传图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.errorTip('上传图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M;
      },
      //提交表单更新商品的函数
       onSubmit(formName){
      	this.$refs[formName].validate((valid)=>{
      		if(valid){
      			//判断图片是否已经上传
      		if(this.formData.imageUrl===''){
      		  this.errorTip("未上传图片")
              return
            }
            //发送axios请求提交
            let typeId;
            //根据分类名去获取分类id
            for(let i of this.goodsTypes){
            	if(i.typeName===this.formData.typeName){
            		typeId = i.typeId
            		break;
            	}
            }
            //发送axios请求去更新商品
            this.$api.goods.updateGoods({
            	goodsId:this.formData.goodsId,
            	goodsName:this.formData.goodsName,
            	goodsDesc:this.formData.goodsDesc,
            	goodsPrice:this.formData.goodsPrice,
            	typeId:typeId,
            	goodsRepertory:this.formData.goodsRepertory,
            	imageUrl:this.formData.imageUrl
            }).then(res=>{
    			Message({
		      	message:'创建成功',
		      	type:'success',
		      	duration:5*1000
		    	})
            	//重新获取表格数据
            	this.getTableData(this.page)
            	//关闭模态框
            	this.offDialog()
            }).catch(erro=>{
            	this.errorTip('更新失败，请联系管理员')
            })
          }else{
          	this.errorTip('输入有误，请重新输入')
         }
       })
      },
      //关闭模态框调用的方法
      offDialog(){
      	this.dialogVisible = false;
      	this.formData={};
      },
      //上架或下架商品
      handleGoods(index,status,goodsId){
      	if(status===0){
      		//执行下架操作
      		this.$api.goods.outGoods(goodsId).then(res=>{
      			//修改一个商品的状态 还是不发生axios获取最新的
      			this.tableData[index].goodsStatus = 1;
      			Message({
		      	message:'下架成功',
		      	type:'success',
		      	duration:3*1000
		    	})
      		})
      	}else{
      		//执行上架操作
      		this.$api.goods.goGoods(goodsId).then(res=>{
      			this.tableData[index].goodsStatus = 0;
      			Message({
		      	message:'上架成功',
		      	type:'success',
		      	duration:3*1000
		    	})
      		})
      	}
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
    }
  },
  created:function(){
  	//获取第一页数据
  	this.getTableData(this.page)
  	//获取商品分类的信息
  	this.getGoodsTypes()
    //获取所有商品的数量
    this.getGoodsCount()
  	//将计算属性中的token值赋值给文件上传的请求头
  	this.uploadHeader.Authorization = this.getToken
  },
  computed:{
	...mapGetters('user',['getToken'])
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
