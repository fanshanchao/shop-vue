<template>
	<div class="login">
		<el-container>
			<el-header></el-header>
			<el-main>
				<el-button :plain="true" @click="open8" style="display:none;"></el-button>
				<el-row >
					<el-col :span="6" :offset="9">
						<el-form :model="form" ref="form" status-icon :rules="rules2" >
							<el-form-item  prop="userName">
								<el-input v-model="form.userName" placeholder="用户名" autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item prop="userPassword">
								<el-input placeholder="密码" v-model="form.userPassword" show-password autocomplete="off"></el-input>
							</el-form-item>
							<el-form-item>
								<el-row>
									<el-col :span="6">
										<el-checkbox v-model="form.rememberMe">下次自动登陆</el-checkbox>	
									</el-col>
									<el-col :span="6" :offset="12" >
										<el-button type="text" >忘记密码</el-button>
									</el-col>
								</el-row>	
							</el-form-item>
							<el-form-item>
								<el-button type="primary" id="loginBt" @click="onLogin('form')">登陆</el-button>
								还不是会员？<el-button type="text" ><router-link to="/register" style="color:blue;">立即加入</router-link></el-button>	
							</el-form-item>	
							  <el-popover
							    placement="top-start"
							    width="300"
							    trigger="click"
							    >
							    <p>用户名：root 密码：123456 （超级管理员）</p>
							    <p>用户名：admin 123456 （商品管理员）</p>
							    <p>用户名：admin2 密码：root （订单管理员）</p>
							    <el-button slot="reference">获取管理员账户</el-button>
							  </el-popover> 
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
//import headComponent from './Head.vue' 
//用一个变量保存需要动态加载的路由
var routers = [];
export default {
	name: 'login',
	data () {
		var checkName = (rule,value,callback)=>{
			if(!value){
				return callback(new Error('用户名为空'));
			}else if(value.length<4||value.length>20){
				return callback(new Error('用户名长度必须大于4小于20'));
			}else{
				callback();
			}
		};
		var checkpass = (rule,value,callback)=>{
			if(value===''){
				return callback(new Error('密码为空'))
			}else if(value.length<6||value.length>20){
				return callback(new Error('密码长度必须大于6小于20'));
			}else{
				callback();
			}
		};
		return {
			form:{
				userName:"",
				userPassword:"",
				rememberMe:false,
				tip:""
			},
			rules2:{
				userName:[{validator:checkName,trigger:'blur'}],
				userPassword:[{validator:checkpass,trigger:'blur'}]
			}
		}
	},
	methods:{
		onLogin(formName){
			this.$refs[formName].validate((valid)=>{
				if(valid){
					//调用用户登陆接口
					this.$api.user.userLogin(this.form).then(res=>{
						console.log(res)
						//如果返回错误信息 提示用户
						if(res.data.code!==200){
							this.form.tip = res.data.msg;
							this.open8();
						}else{
							console.log("登陆成功")
							//将服务器返回的token加入到vuex中去 
							//注意这里通过user/addTokenAsync选择user模块里面的函数
							this.$store.dispatch('user/addTokenAsync',res.data.token)
							// //根据角色名动态加载路由
							// dyRouters(routers,res.data.roleName)
							// alert(routers)
							// //添加路由信息到vuex中去
							// this.$store.dispatch('user/addRoutersAsync',routers)
							// //动态加载路由
							// this.$router.addRoutes(routers)
							//判断跳转到前一路由还是首页
							console.log('准备跳转')
							this.$router.push(this.$route.query.redirect||'/')
						}
					}).catch(error=>{
						//使用element的错误提示
						Message({
							message:"服务器内部错误，联系管理员",
							type:'error',
							duration:5*1000
						})
					})
				}else{
					return false;
				}
			})
			
		},
		open8(){
			this.$message({
				showClose:true,
				message:this.form.tip,
				type:'error',
				duration:3000
			})
		}
	}
}
</script>


<style scoped>
.el-form{
	margin-top:40%;
	text-align: center;
}
#loginBt{
	width:100%;
}
</style>
