<template>
  <div class="consoleAddGoods">
  	<el-row>
  		<el-col :span="10" :offset="6">
       <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="商品标题" prop="goodsName">
          <el-input type="textarea" v-model="form.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="goodsDesc">
          <el-input type="textarea" v-model="form.goodsDesc"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" >
          <el-input-number v-model="form.goodsRepertory"  :min="1" :max="100000" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input-number v-model="form.goodsPrice" :precision="2" :step="1" :min="1.00" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item label="商品分类">
         <el-select v-model="form.selectValue" value-key="typeId" placeholder="请选择" @change="selectChange">
          <el-option
          v-for="item in form.goodsTypes"
          :key="item.typeId"
          :label="item.typeName"
          :value="item">
        </el-option>
      </el-select>
      <el-button  @click="addType">创建分类</el-button>
    </el-form-item>
    <el-form-item label="商品主图">
      <img v-if="form.imageUrl!==''"  :src="form.baseImage+form.imageUrl" style="width:100px;height:100px;">
     <el-upload
     class="avatar-uploader"
     :headers="form.uploadHeader"
     :action="form.uploadAddress"
     :show-file-list="true"
     :limit="1"
     :on-success="handleAvatarSuccess"
     :before-upload="beforeAvatarUpload"
     :auto-upload="true"
     >
     <el-button slot="trigger" size="small" type="success">选取图片</el-button>
     <div slot="tip" class="el-upload__tip">只能上传一张jpg文件，且不超过2M</div>
   </el-upload>
 </el-form-item>
 <el-form-item>
  <el-button type="primary" @click="onSubmit('form')">立即添加</el-button>
</el-form-item>
</el-form>
</el-col>
</el-row>
</div>
</template>

<script>
import { Message } from 'element-ui' //使用emlent的错误提示
import base from '@/request/api/base'
import {mapGetters} from 'vuex';//获取token 以便于用于文件上传
export default {
  name: 'ConsoleAddGoods',
  data () {
    return {
    	form:{
    		goodsName:'',
    		goodsDesc:'',
    		goodsRepertory:1,
    		goodsPrice:1.00,
    		goodsTypes:[],
    		selectValue:'',
        imageUrl: '',
        selectTypeId:-1,
        	//文件上传地址
      	uploadAddress:base.lo+'uploadGoodsImage',
      	uploadHeader:{
      		Authorization:''
      	},
        baseImage:base.image
        },
        rules:{
          goodsName:[
          {required:true,message:'请输入商品名',trigger:'blur'},
          {min:5,max:100,message:'商品名在5~100字',trigger:'blur'},
          { pattern: /^\S+$/, message: '不允许有空格', trigger: 'blur' }],
          goodsDesc:[
          {required:true,message:'请输入商品描述',trigger:'blur'},
          {min:10,max:200,message:'描述在10~200字',trigger:'blur'},
          { pattern: /^\S+$/, message: '不允许有空格', trigger: 'blur' }
          ]
        }
      }
    },
    created:function(){
     this.getSeleceData()
  	//将计算属性中的token值赋值给文件上传的请求头
  	this.form.uploadHeader.Authorization = this.getToken
  },
  methods:{
  	  //上传文件成功后的回调函数
  	  handleAvatarSuccess(res, file) {
        //this.imageUrl = URL.createObjectURL(file.raw);
        //上传成功后将后台返回的url保存起来 以便于提交表单时使用
        if(res.code!==200){
         Message({
          message:res.msg,
          type:'error',
          duration:5*1000
        })
       }else{
         this.form.imageUrl = res.data
       }
     },
      //在文件上传前的回调函数
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //获取分类选择框的值
      getSeleceData(){
      	this.$api.goods.getGoodsTypes().then(res=>{
      		this.form.goodsTypes = res.data.data
      		//将当前选中值改成第一个对象
      		this.form.selectValue = this.form.goodsTypes[0].typeName;
      		this.form.selectTypeId = this.form.goodsTypes[0].typeId
      		//console.log("selectValue"+this.form.selectValue.typeId)   		
      	})
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
        			Message({
                message:res.data.msg,
                type:'error',
                duration:5*1000
              })
        		}else{
        			//重新去获取一下选择分类框的值
        			this.getSeleceData()
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
      onSubmit(formName){
      	//提交表单创建商品的函数
      	this.$refs[formName].validate((valid)=>{
      		if(valid){
      			//判断图片是否已经上传
      			if(this.form.imageUrl===''){
              Message({
                message:"未上传图片",
                type:'error',
                duration:5*1000
              })
              return
            }
      			//发送axios请求进行添加
      			this.$api.goods.addGoods({
      				goodsName:this.form.goodsName,
      				goodsDesc:this.form.goodsDesc,
      				goodsPrice:this.form.goodsPrice,
      				typeId:this.form.selectTypeId,
      				goodsRepertory:this.form.goodsRepertory,
      				imageUrl:this.form.imageUrl
      			}).then(res=>{
              Message({
                message:"添加成功",
                type:'success',
                duration:5*1000
              })
              //添加成功后将所有信息置为空
              this.emptyForm()
            }).catch(error=>{
              Message({
                message:"添加异常，请联系管理员",
                type:'error',
                duration:5*1000
              })	
            })
          }else{
           Message({
             message:"输入有误，请重新输入",
             type:'error',
             duration:5*1000
           })	
         }
       })
      },
      //选择分类框切换选项事件的函数
      selectChange(val){
      	//将选择项的id赋值给表单对象中这个对象
      	this.form.selectTypeId = val.typeId
      },
      //置空form信息
      emptyForm(){
        this.form.goodsName = ''
        this.form.goodsDesc = ''
        this.form.goodsRepertory = 1
        this.form.goodsPrice = 1.00
        this.form.imageUrl = ''
      }
    },
    computed:{
     ...mapGetters('user',['getToken'])
   }
 }
 </script>


 <style scoped>

 </style>
