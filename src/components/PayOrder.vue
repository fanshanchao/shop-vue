<template>
	<div class="payOrder">
		<headComponent></headComponent>
		<el-row>
			<el-col :span="16" :offset="4">
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
				<h4>购物清单：</h4>
				<el-table
				:data="getPayCarts"
				style="width: 100%">
				<el-table-column
				label="商品名称"
				>
				<template slot-scope="scope">
					<el-row style="">
						<el-col :span="6">
							<img :src="base.image+scope.row.imageUrl">
						</el-col>
						<el-col :span="18">
							<p style="color:black;">{{scope.row.goodsName}}</p>  
						</el-col>
					</el-row>
				</template>
			</el-table-column>
			<el-table-column
			prop="goodsPrice"
			label="售价"
			width="180">
		</el-table-column>
		<el-table-column
		prop="num"
		label="数量"
		width="180">
	</el-table-column>
	<el-table-column
	label="小计"
	width="180">
	<template slot-scope="scope"><span style="color:red;font-size:15px;">￥{{scope.row.summary.toFixed(2)}}</span></template>
</el-table-column>
</el-table>
<div style="float:right;margin-top:20px;">
	<span >应付款金额<span style="color:red;font-size:40px;">￥{{totalMoney.toFixed(2)}}</span></span>
	<br/>
	<br/>
	<el-button type="danger" @click="submitOrder('formData')">提交订单</el-button>
</div>
</el-col>
</el-row>
<footerComponent style="margin-top:20px;"></footerComponent>
</div>
</template>

<script>
//导入head组件
import headComponent from './Head.vue'
//导入footer组件
import footerComponent from './Footer.vue'
//导入图片服务器地址
import base from '@/request/api/base'
//导入几个vuex的简便api
import {mapGetters,mapActions} from 'vuex';
export default {
	name: 'PayOrder',
	data () {
		return {
			base:base,
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
  	//页面创建的时候判断vuex中存了选中商品没 如果没有就跳转回购物车页面
  	if(!this.getPayCarts){
  		this.$message.error('订单失效，返回购物车');
  		this.$router.push({path:'/shoppingCart'})
  		return
  	}
  },
  computed:{
  	...mapGetters('carts',['getPayCarts']),
  	//订单的总价的计算属性
  	totalMoney:function(){
  		let total = 0.00
  		for(let i of this.getPayCarts){
  			total += i.summary
  		}
  		return total
  	}
  },
  components:{headComponent,footerComponent},
  methods:{
  	//重置表单的函数
  	resetForm(formName){
  		this.$refs[formName].resetFields();
  	},
  	//提交订单的方法
  	submitOrder(formName){
  		//判断表单是否符合校验规则
  		this.$refs[formName].validate((valid)=>{
  			if(valid){
  				//发送axios请求提交订单

  				//先重新获取提交需要的数据 商品id和数量
  				let sums = []//保存了等下需要从购物车删除的商品id
  				let orderItems = []
  				for(let i of this.getPayCarts){
  					sums.push(i.goodsId)
  					orderItems.push({
  						goodsId:i.goodsId,
  						goodsNumber:i.num
  					})
  				}
  				//发送axios请求去提交一个订单
  				this.$api.order.submitOrder({
  					receiverName:this.formData.receiverName,
  					mobile:this.formData.mobile,
  					address:this.formData.address,
  					message:this.formData.message,
  					orderItems:orderItems
  				}).then(res=>{
  					//清空vuex中支付商品
  					this.clearAddPayCartsAsync()
  					//删除购物车中已经下单的商品
  					this.deleteGoodsAsync(sums)
  					//跳转到付款页面 将生成订单id作为参数传过去 使用repalace 将不能回退在支付订单页面 防止重复提交
  					this.$router.replace({path:'payMoney/'+res.data.data})
  				}).catch(error=>{
  					this.$message.error('订单提交错误，请联系管理员');
  				})

				this.$message.success('提交成功');
  			}else{
  				this.$message.error('收货人信息填写有误');
  			}
  		})
  	},
  	...mapActions('carts',['clearAddPayCartsAsync','deleteGoodsAsync'])
  }
}
</script>

<style scoped>
img{
	width:60px;
	height:60px;
}
</style>
