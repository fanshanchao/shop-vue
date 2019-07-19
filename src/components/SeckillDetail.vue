<template>
  <div class="seckillDetail">
  	<headComponent></headComponent>
  	<el-row>
  		<el-col :span="16" :offset="4">
    		<div class="seckillBox" >
    			<h4>{{seckill.goods.goodsName}}</h4>
    			<img :src="base.image+seckill.goods.imageUrl" alt="商品主图">	
    			<p>{{seckill.goods.goodsDesc}}</p>

    			<p v-if="!isOpen&&!isEnd"><i class="el-icon-time"></i>倒计时开启：{{countDownDay}}天{{countDownHour}}小时{{countDownMiunte}}分{{countDownSecond}}秒</p>
    			<p v-else-if="isOpen&&!isEnd"><i class="el-icon-time"></i>秒杀剩余：{{countDownDay}}天{{countDownHour}}小时{{countDownMiunte}}分{{countDownSecond}}秒</p>
    			<p v-else="isOpen&&isEnd"><i class="el-icon-time"></i>秒杀已结束</p>   			
    			<h4>剩余库存：{{seckill.seckillRepertory}}</h4>
    			<el-button v-if="!isOpen&&!isEnd" type="danger"  disabled>￥{{seckill.seckillPrice}}秒杀未开启</el-button>
    			<el-button v-else-if="isOpen&&!isEnd" type="danger" @click="seckillSubmit('formData')" >￥{{seckill.seckillPrice}}秒杀</el-button>
				<el-button v-else="!isOpen&&isEnd" type="danger"  disabled>￥{{seckill.seckillPrice}}秒杀已结束</el-button>
				<br>
				<el-button style="margin-top:20px;" v-if="isSeckill" type="success" @click="paySeckill()">(秒杀成功)去支付秒杀</el-button>
					<h4>收货人信息：</h4>
					<el-form :model="formData" :rules="rules" status-icon ref="formData" label-width="100px" class="inforForm">
					  <el-form-item label="收货姓名" prop="receiverName">
					    <el-input  v-model="formData.receiverName" ></el-input>
					  </el-form-item>
					  <el-form-item label="收货地址" prop="address">
					    <el-input  v-model="formData.address" ></el-input>
					  </el-form-item>
					  <el-form-item label="联系电话" prop="mobile">
					    <el-input  v-model="formData.mobile" ></el-input>
					  </el-form-item>
					  <el-form-item label="订单留言" prop="message">
					    <el-input  v-model="formData.message" ></el-input>
					  </el-form-item>
					  <el-form-item>
					    <el-button @click="resetForm('formData')">重置</el-button>
					  </el-form-item>
					</el-form>
  			</div>
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
//导入时间格式化工具
import {dateFormat} from '../myUtil/dateUtil'
export default {
  name: 'seckillDetail',
  data () {
    return {
    	base:base,
    	isOpen:false,//标志秒杀是否开启
    	isEnd:false,
    	seckill:{},
    	countDownTime:0,
    	isSeckill:false,//标记用户是否秒杀成功
    	orderId:-1,//秒杀成功的订单id
    	timer:"",//接受定时器
    	seckillApi:'',
		formData:{
			receiverName:'',
			mobile:'',
			address:'',
			message:''

		},
		rules:{
			receiverName:[
			{required:true,message:'请输入收货人姓名',trigger:'blur'},
			{min:2,max:20,message:'姓名长度在2到20',trigger:'blur'},
			{pattern: /^\S+$/, message: '不允许有空格', trigger: 'blur'}],
			mobile:[
			{required:true,message:'请输入联系电话',trigger:'blur'},
			{ pattern: /^\d{6,11}$/, message: '输入正确的电话格式', trigger: 'blur' }],
			address:[
			{required:true,message:'请输入收货地址',trigger:'blur'},
			{min:10,max:100,message:'地址长度在10到100',trigger:'blur'},
			{ pattern: /^\S+$/, message: '不允许有空格', trigger: 'blur' }],
			message:[
			{pattern: /^\S+$/, message: '不允许有空格', trigger: 'blur'}]
		}
    }
  },
  created:function(){
  	this.getSeckillData(this.$route.params.seckillId)
  },
  methods:{
  	//获取当前秒杀的详情信息
  	getSeckillData(seckillId){
  		this.$api.seckill.getSeckillById(seckillId).then(res=>{
  			this.seckill = res.data.data
  			//获取当前系统时间
  			this.getNow()
  		}).catch(res=>{
	  		Message({
		      message:'获取秒杀信息失败，联系管理员',
		      type:'error',
		      duration:5*1000
		    })
  		})
  	},
  	//倒计时函数
  	countDown(){
  			let _this = this
			this.timer = setInterval(()=> {
				//如果倒计时结束 代表秒杀借宿 那么销毁计时器
				if(this.countDownTime < 0&&this.isOpen&&!this.isEnd){
					this.isOpen = false
					this.isEnd = true
					this.countDownTime = 0
					//清除计时器
					clearInterval(_this.timer)
					return
				}else if(this.countDownTime < 0&&!this.isEnd&&!this.isOpen){
					//如果计数器到0 且当前秒杀还没有结束 那么说明秒杀开启倒计时结束 重新获取系统时间 以便于开启倒计时和获取秒杀地址
					this.getNow()
					//清除计时器
					clearInterval(_this.timer)
					return
				}
				this.countDownTime -= 1000
				//console.log(this.countDownTime)
			}, 1000);
  	},
  	//获取当前系统时间
  	getNow(){
  		this.$api.seckill.getSystemTime().then(res=>{
  			//代表秒杀还没开启 进行等待秒杀开始倒计时
  			if(res.data.data < this.seckill.startTime){
  				this.isOpen = false
  				this.isEnd = false
  				this.countDownTime = this.seckill.startTime - res.data.data
  				this.countDown()
  			}else if(res.data.data >= this.seckill.startTime&&res.data.data < this.seckill.endTime){
  				//如果秒杀已经开启且秒杀还没有结束 那么进行秒杀结束倒计时
  				//可以直接获取秒杀接口了
  				this.getSeckillApi(this.seckill.seckillId)
  				this.isOpen = true
  				this.isEnd = false
  				this.countDownTime = this.seckill.endTime - res.data.data
  				this.countDown()
  			}else{
  				//否则代表秒杀已经结束
  				this.isOpen = false
  				this.isEnd = true
  			}
  		}).catch(error=>{
	  		Message({
		      message:'获取系统时间失败，联系管理员',
		      type:'error',
		      duration:5*1000
		    })	
  		})
  	},
  	//获取秒杀接口
  	getSeckillApi(seckillId){
  		this.$api.seckill.getSeckillApi(seckillId).then(res=>{
  			if(!res.data.data.open){
	 	  		Message({
			      message:'秒杀未开启',
			      type:'error',
			      duration:5*1000
			    })
  			}else{
  				//得到秒杀接口
  				this.seckillApi = res.data.data.md5
  			}
  		}).catch(error=>{
	  		Message({
		      message:'获取秒杀地址失败，联系管理员',
		      type:'error',
		      duration:5*1000
		    })			
  		})
  	},
  	//重置表单的方法
  	resetForm(formName){
  		this.$refs[formName].resetFields();
  	},
  	//提交秒杀订单的函数
  	seckillSubmit(formName){
  		//判断表单是否符合校验规则
  		this.$refs[formName].validate((valid)=>{
  			if(valid){
  				let orderItems = []
  				orderItems.push({
  					goodsId:this.seckill.goods.goodsId,
  					goodsNumber:1
  				})
  				//开始发送请求提交秒杀
  				this.$api.seckill.submitSeckill({
  					seckillId:this.seckill.seckillId,
  					md5:this.seckillApi,
  					params:{
  						receiverName:this.formData.receiverName,
  						mobile:this.formData.mobile,
  						address:this.formData.address,
  						message:this.formData.message,
  						orderItems:orderItems
  					}
  				}).then(res=>{
  					if(res.data.code===400){
			 	  		Message({
					      message:res.data.msg,
					      type:'error',
					      duration:5*1000
					    })
  					}else{
			 	  		Message({
					      message:'秒杀成功',
					      type:'success',
					      duration:5*1000
					    })
  						this.isSeckill = true
              //将秒杀关闭 防止用于点击按钮重复秒杀
              this.isOpen = false
              this.isEnd = true
  						this.orderId = res.data.data.orderId
  					}
  				}).catch(error=>{
		 	  		Message({
				      message:'秒杀失败，服务器内部原因，请联系管理员',
				      type:'error',
				      duration:5*1000
				    })
  				})
  			}else{
  				this.$message.error('收货人信息填写有误');
  			}
  		})
  	},
  	//支付秒杀的方法
  	paySeckill(){
  		this.$router.push('/payMoney/'+this.orderId)
  	}
  },
  computed:{
  	//计算属性 倒计时天数
  	countDownDay:function(){
  		return parseInt(this.countDownTime/1000/60/60/24)
  	},
  	//倒计时小时
  	countDownHour:function(){
  		return parseInt(this.countDownTime/1000/60/60%24)
  	},
  	//倒计时分数
  	countDownMiunte:function(){
  		return parseInt(this.countDownTime/1000/60%60)
  	},
  	//倒计时秒数
  	countDownSecond:function(){
  		return parseInt(this.countDownTime/1000%60) 
  	}
   },
    beforeDestroy() {
        //清除定时器
        clearInterval(this.timer);
        console.log("beforeDestroy");
    },
    destroyed() {
        //清除定时器
        clearInterval(this.timer);
        console.log("destroyed");
    },
  components:{headComponent,footerComponent}
}
</script>


<style scoped>
img{
	width:150px;
	height:150px;
}
.seckillBox{
	text-align:center;
}
</style>
