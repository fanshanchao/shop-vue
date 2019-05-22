<template>
	<div class="head">
		<el-row >
			<el-col :span="1" :offset="1">
				<el-button type="text" class="bt"><router-link to="/">首页</router-link></el-button>
			</el-col>
			<el-col :span="2" :offset="15">
				<!-- 根据用户是否登陆来显示注册还是用户名-->
				<div v-if="getToken" class="menu">
					<el-dropdown>
						<span class="el-dropdown-link">
							{{getUserNickName}}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item disabled><router-link to="/" style="color:#909399;">个人中心</router-link></el-dropdown-item>
							<el-dropdown-item><router-link to="/userOrders/-1">订单中心</router-link></el-dropdown-item>
							<!-- 判断是否是管理员 -->
							<div v-if="getRoleName !=='商城会员'">
							<el-dropdown-item ><router-link to="/console">后台管理</router-link></el-dropdown-item>
							</div>
							<el-dropdown-item><el-button type="text" @click="userLogout">退出登陆</el-button></el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
				<div v-else>
					<el-button type="text" class="bt"><router-link to="/login">登陆/注册</router-link></el-button>
				</div>
			</el-col>
			<el-col :span="1" :offset="1">
				<el-badge is-dot class="bt">
					<el-button type="text"><router-link to="/shoppingCart">购物车</router-link></el-button>
				</el-badge>
			</el-col>
			<el-col :span="1" :offset="1">
				<el-button type="text" class="bt"><a :href="base.github">关于网站</a></el-button>
			</el-col>
		</el-row>
	</div>
</template>

<script>
//导入几个vuex的简便api
import {mapGetters} from 'vuex';
import base from '@/request/api/base'
export default {
	name: 'HelloWorld',
	data () {
		return {
			head:{
				isAdmin:false
			},
			base:base
		}
	},
// 	created:function(){
//     //在dom还没生成之前发送一个axios请求判断用户是否登陆
//     this.$api.user.userRefresh().then(res=>{
//       //如果已经登陆 则在data中标志当前用户已经登陆
//       if(res.data.code===200){
//       	this.head.isLogin = true;
//       }else{
//         //清除存在loaclstorage和vuex上的用户信息
//         this.$store.dispatch('user/deleteTokenAsync');
//     }
// }).catch(error=>{
//         //清除存在loaclstorage和vuex上的用户信息
//         this.$store.dispatch('user/deleteTokenAsync');
//         //删除路由信息
//         this.$store.dispatch('permission/deleteDyRoutersAsyc');
//     })
// },
computed:{
	...mapGetters('user',['getUserNickName','getRoleName','getToken'])
},methods:{
	userLogout(){
		//用来执行登出操作
		this.$api.user.userLogout().then(res=>{
			//清除存在loaclstorage和vuex上的用户信息
	        this.$store.dispatch('user/deleteTokenAsync');
	        //进行跳转到首页操作 
	        this.$router.push('/')
		})
	}
}
}
</script>

<style scoped>
.el-row{
	border-bottom-style:solid;
	border-bottom-width:1px;
	border-bottom-color:#EBEEF5;
}
.bt{
	margin:4px 0px 0px 0px;
}
.menu{
	margin-top:10px;
}
a {
	text-decoration: none;
	color:#303133;
}
.router-link-active {
	text-decoration: none;
}
</style>