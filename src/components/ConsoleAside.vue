<template>
	<div class="consoleAside">
		<el-menu 
		v-bind:style="menuCss"
		default-active="$route.path"
		class="el-menu-vertical-demo"
		background-color="#34495E"
		text-color="#FFFFFF"
		:unique-opened=true
		router
		@open="handleOpen"
		@close="handleClose">
		<h3 style="color:#FFFFFF;">          <svg class="icon" aria-hidden="true">
			<use xlink:href="#icon-changjingguanli"></use>
		</svg>商城后台管理</h3>
		<div v-if="isContainsMenu('user')">
			<el-submenu index="1">
				<template slot="title">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-user"></use>
					</svg>
					<span>用户管理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item v-if="isContainsPermission('user:list')" index="user">用户列表</el-menu-item>
					<el-menu-item v-if="isContainsPermission('role:update')"  index="role">权限修改</el-menu-item>
					<el-menu-item v-if="isContainsPermission('role:update')" index="addRole">添加角色</el-menu-item>
				</el-menu-item-group>
			</el-submenu>	
		</div>
		<div v-if="isContainsMenu('order')">
			<el-submenu index="2">
				<template slot="title">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-gongdan"></use>
					</svg>
					<span>订单管理</span>
				</template>
				<el-menu-item-group>
					<div v-if="isContainsPermission('order:update')">
						<el-badge v-if="unOrderCount>0" :value="unOrderCount" class="item">
							<el-menu-item index="dealOrders">待处理</el-menu-item>
						</el-badge>
						<el-menu-item v-else index="dealOrders">待处理</el-menu-item>
					</div>
					<div v-if="isContainsPermission('order:list')">
						<el-menu-item index="orders">订单列表</el-menu-item>
					</div>
				</el-menu-item-group>
			</el-submenu>
		</div>
		<div v-if="isContainsMenu('goods')">
			<el-submenu index="3">
				<template slot="title">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#icon-shopping"></use>
					</svg>
					<span>商品管理</span>
				</template>
				<el-menu-item-group>
					<div v-if="isContainsPermission('goods:add')">
						<el-menu-item index="addGoods">添加商品</el-menu-item>
					</div>
					<div v-if="isContainsPermission('goods:list')">
						<el-menu-item index="goods">商品列表</el-menu-item>
					</div>
				</el-menu-item-group>
			</el-submenu>
		</div>
	</el-menu>
</div>
</template>

<script>
import {mapGetters} from 'vuex';
//导入判断权限工具
import {isContainsMenu,isContainsPermission} from '../myUtil/permisssionUtil'
export default {
	name: 'ConsoleAside',
	data () {
		return {
			menuCss:{
				//屏幕高度为可用高度
				height: window.screen.availHeight+'px',
				//未处理订单数量
			},
			unOrderCount:0
		}
	},
	methods:{
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		},
		isContainsMenu:isContainsMenu,
		isContainsPermission:isContainsPermission,
		userClick(param){
			console.log('跳转到用户管理')
			//这个方法用来进行路由跳转 并且传入参数标志当前需要做的事
			this.$router.push({
				name:'consoleUser',
				params:{
					method:param
				}
			})
		}

	},
	computed:{
		...mapGetters('user',['getUserPermission'])
	},
	created:function(){
		this.$api.order.getUnOrderCount().then(res=>{
			this.unOrderCount = res.data.data
		})
	}
}
</script>
<style scoped>
.el-menu{
	text-align:center;
}
.item {
}
</style>