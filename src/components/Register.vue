<template>
	<div class="register">
		<el-container>
			<el-header></el-header>
			<el-main>
				<el-row>
					<el-col :span="6" :offset="9">
						<el-form  :model="form" status-icon :rules="rules" ref="form">
							<el-form-item   prop="userName">
								<el-input v-model="form.userName" placeholder="用户名" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item  prop="userPassword">
								<el-input v-model="form.userPassword" type="password" placeholder="密码" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item  prop="checkPass">
								<el-input v-model="form.checkPass" type="password" placeholder="确认密码" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item  prop="nickName">
								<el-input v-model="form.nickName" placeholder="昵称" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item prop="email">
								<el-input v-model="form.email" placeholder="输入邮箱注册" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item prop="verCode">
								<el-row>
									<el-col :span="14">
										<el-input placeholder="输入邮箱验证码" v-model="form.verCode"></el-input>
									</el-col>
									<el-col :span="8" :offset="1">
										<div v-if='form.isSend'>
											<el-button  disabled>{{form.sendTimeout}}后重新获取</el-button>
										</div>
										<div v-else>
											<el-button @click="getCode">获取验证码</el-button>
										</div>
									</el-col>
								</el-row>
							</el-form-item>
							<el-form-item>
								<el-button type="primary"  id="resBt" @click="submitForm('form')" >注册</el-button>
							</el-form-item>
						</el-form>
					</el-col>
				</el-row>
			</el-main>
		</el-container>

	</div>
</template>

<script>
import { Message } from 'element-ui' //使用emlent的错误提示
//导入head组件
// import headComponent from './Head.vue' 
export default {
	name: 'register',
	data () {
		var checkUserPassword = (rule,value,callback)=>{
			if(!value){
				return callback(new Error('密码不能为空'))
			}
			if(value.length<6||value.length>20){
				return callback(new Error('密码长度必须大于6小于20'))
			}
			//如果确认密码不为空 调用确认密码的validate验证
			if(this.form.checkPass!==''){
				this.$refs.form.validateField('checkPass');
			}
			callback()
		};
		var checkUserPassword2 = (rule,value,callback)=>{
			if(!value){
				return callback(new Error('密码不能为空'))
			}else if(value!==this.form.userPassword){
				callback(new Error('两次密码输入不一致'))
			}
			callback();

		};
		return {
			form:{
				userName:'',
				userPassword:'',
				checkPass:'',
				nickName:'',
				email:'',
				verCode:'',
				isSend:false,//用于标记验证码是否发送
				sendTimeout:0//用于发送验证码过后的多久可以重新发送验证码
			},
			rules:{
				userName:[
				{required:true,message:'请输入用户名',trigger:'blur'},
				{min:5,max:20,message:'用户名在5~20字',trigger:'blur'},
				{ pattern: /^\S+$/, message: '不允许有空格', trigger: 'blur' }],
				userPassword:[{
					validator:checkUserPassword,trigger:'blur'
				}],
				checkPass:[{
					validator:checkUserPassword2,trigger:'blur'
				}],
				nickName:[
				{required:true,message:'请输入昵称',trigger:'blur'},
				{min:1,max:10,message:'昵称长度必须小于10',trigger:'blur'},
				{ pattern: /^\S+$/, message: '不允许有空格', trigger: 'blur'}],
				email:[
				{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
				{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
				],
				verCode:[
				{required:true,message:'请输入验证码',trigger:'blur'},
				{min:1,max:10,message:'验证码必须小于10位',trigger:'blur'},
				{ pattern: /^\S+$/, message: '不允许有空格', trigger: 'blur' }]
			}
		}
	},
	methods:{
		submitForm(formName){
			this.$refs[formName].validate((valid)=>{
				if(valid){
					//调用axios执行注册
					this.$api.user.addUser({
						userName:this.form.userName,
						userPassword:this.form.userPassword,
						nickName:this.form.nickName,
						email:this.form.email,
						verCode:this.form.verCode
					}).then(res=>{
						if(res.data.code!==200){
							Message({
								message:res.data.msg,
								type:'error',
								duration:3*1000
							})
						}else{
							//跳转到登陆页面
							this.$router.replace('/login');
						}
					}).catch(error=>{
						Message({
							message:"服务器内部错误，请联系管理员",
							type:'error',
							duration:5*1000
						})
					})
				}else{
					Message({
						message:"输入有误，请确认无误后再提交",
						type:'error',
						duration:5*1000
					})
				}
			})
		},
		getCode(){
			//验证邮箱是否校验成功
			this.$refs.form.validateField('email',(valid)=>{
				if(valid){
					Message({
						message:"请输入正确的邮箱地址以便于发送验证码",
						type:'error',
						duration:5*1000
					})
				}else{
					this.form.isSend = true
					//将重新发送验证码的时间置为想要设置的时间
					this.form.sendTimeout = 120
					//调用倒计时函数
					this.countDown()
					//发送axios请求获取验证码
					this.$api.user.getVerCode({
						email:this.form.email
					}).then(res=>{
						//如果服务端返回错误信息 
						if(res.data.code!==200){
							Message({
								message:res.data.msg,
								type:'error',
								duration:5*1000
							})
							//并且清除前面这个计时器
							this.form.sendTimeout = 3;
						}else{
							Message({
								message:"验证码发送成功，请注意查收",
								type:'success',
								duration:5*1000
							})
						}
					}).catch(error=>{
						Message({
							message:"服务器内部错误，请联系管理员",
							type:'error',
							duration:5*1000
						})
						//并且清除前面这个计时器
						this.form.sendTimeout = 3;
					})
				}
			})
		},
		countDown(){
			setTimeout(()=> {
				this.form.sendTimeout -= 1
				if(this.form.sendTimeout < 0){
					//如果倒计时结束就将isSend置位false
					this.form.isSend = false
					//并且清除前面这个计时器
					clearTimeout(this.authTimeTimer);
				}else{
					//否则继续执行这个异步函数
					this.countDown()
				}
			}, 1000);
		}
	}
}
</script>


<style scoped>
.el-form{
	margin-top:40%;
	text-align: center;
}
#resBt{
	width:100%;
}
</style>
