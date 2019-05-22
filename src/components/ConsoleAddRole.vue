<template>
  <div class="consoleAddRole">
  <el-row >
   	<el-col :span="2">
   		角色名：
   	</el-col>
   	<el-col :span="4">
   		<el-input v-model="selectPermission.selectRoleName" placeholder="请输入角色名"></el-input>
   	</el-col>
  </el-row>
  <el-row>
  <span>用户管理:</span>
  <el-checkbox v-model="selectPermission.userList" >查看用户</el-checkbox>
  <el-checkbox v-model="selectPermission.userUpdate" disabled>修改用户</el-checkbox>
  <el-checkbox v-model="selectPermission.userRole" disabled>修改权限</el-checkbox>
  </el-row>
  <el-row >
    <span>订单管理:</span>
  <el-checkbox v-model="selectPermission.orderList" >查看订单</el-checkbox>
  <el-checkbox v-model="selectPermission.orderUpdate" >处理订单</el-checkbox>
  <el-checkbox v-model="selectPermission.orderDelete" >删除订单</el-checkbox>
  </el-row>
  <el-row>
  <span>订单管理:</span>
  <el-checkbox v-model="selectPermission.goodsList" >查看商品</el-checkbox>
  <el-checkbox v-model="selectPermission.goodsAdd" >添加商品</el-checkbox>
  <el-checkbox v-model="selectPermission.goodsUpdate" >修改商品</el-checkbox>
  </el-row>
  <el-row>
  	 <el-button  type="primary" @click="addRolePermission">添加角色</el-button>
  </el-row>
  </div>
</template>

<script>

import { Message } from 'element-ui' //使用emlent的错误提示
export default {
  name: 'ConsoleAddRole',
  data () {
    return {
     selectPermission:{
	  selectRoleName:'',
	  userList:false,
	  userUpdate:false,
	  userRole:false,
	  orderList:false,
	  orderDelete:false,
	  orderUpdate:false,
	  goodsList:false,
	  goodsAdd:false,
	  goodsUpdate:false
	  }
    }
  },
  methods:{
  	addRolePermission(){
  		//根据选中值进行保存permission的id 注意这个id是根据后台根据数据库来的 感觉这样好点 不然要多进行很多次数据库查询
  		let permissionList = []
  		if(this.selectPermission.userList) permissionList.push(1);
  		if(this.selectPermission.userRole) permissionList.push(13);
  		if(this.selectPermission.userUpdate) permissionList.push(2);
  		if(this.selectPermission.orderList) permissionList.push(9);
  		if(this.selectPermission.orderDelete) permissionList.push(12);
  		if(this.selectPermission.orderUpdate) permissionList.push(10);
  		if(this.selectPermission.goodsList) permissionList.push(5);
  		if(this.selectPermission.goodsAdd) permissionList.push(7);
  		if(this.selectPermission.goodsUpdate) permissionList.push(6);
  		//判断权限数组的长度必须至少勾选一个权限
  		if(permissionList.length===0){
  			this.alertError("请至少勾选一个权限")
  			return;
  		}
  		 //判断角色名是否为空
  		if(this.selectPermission.selectRoleName===''){
  			this.alertError('角色名有误')
  			return;
  		}
  		//进行创建角色操作
  		this.$api.role.addRole({
  			roleName:this.selectPermission.selectRoleName,
  			permissionList:permissionList
  		}).then(res=>{
  			if(res.data.code!==200){
		 	     Message({
			      message:res.data.msg,
			      type:'error',
			      duration:5*1000
			    })
  			}else{
		 	     Message({
			      message:"添加成功",
			      type:'success',
			      duration:5*1000
			    })
  			}
  		})
  	}
  }
}
</script>


<style scoped>
.el-row{
  margin-top:5%;
  margin-left:35%;
}
.el-button{
	margin-left:20%;
	margin-top:1%;
}
</style>