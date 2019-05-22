<template>
	<div class="consoleHeader">
		<el-row >
			<el-col :span="6" :offset="8">
				<div style="margin-top:14px;">
					<span >欢迎回来，你的身份是{{getRoleName}}!</span>
				</div>
				
			</el-col>
			<el-col :span="2" :offset="7">
				<el-dropdown >
					<span class="el-dropdown-link">
						{{getUserNickName}}<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item><el-button type="text"><router-link to="/">回到首页</router-link></el-button></el-dropdown-item>
						<el-dropdown-item><el-dropdown-item><el-button type="text" @click="userLogout">退出登陆</el-button></el-dropdown-item></el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
	name: 'ConsoleHeader',
	data () {
		return {
		}
	},
	computed:{
		...mapGetters('user',['getUserNickName','getRoleName'])
	},
	methods:{
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
.consoleHeader{
	background-color:#F2F4F4;
	margin:0px;
	padding:0px;
	height:100%;
}
.el-dropdown{
	margin-top:12%;
}
a {
	text-decoration: none;
	color:#303133;
	margin-left:20px;
	text-align:center;
}
.router-link-active {
	text-decoration: none;
}
</style>
