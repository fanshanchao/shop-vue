<template>
  <div class="consoleRole">
  <el-select v-model="selectValue" placeholder="请选择">
    <el-option
      v-for="item in roles"
      :key="item.roleId"
      :label="item.roleName"
      :value="item.roleName"
      >
    </el-option>
  </el-select>
   <el-row >
   	<el-col :span="2">
   		角色名：
   	</el-col>
   	<el-col :span="4">
   		<el-input v-model="selectPermission.selectRoleName" placeholder="请输入内容"></el-input>
   	</el-col>
  </el-row>
  <el-row>
  	<span>角色id：{{selectPermission.selectRoleId}}</span>
  </el-row>
  <el-row >
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
  	 <el-button @click="resetSelect('')">重置</el-button>
  	 <el-button  type="danger" @click="updateRolePermission">提交修改</el-button>
  </el-row>
  <div id="tip">
  	<span >（注意：商城会员权限不可修改）</span>
  </div>
  </div>
</template>

<script>
import { Message } from 'element-ui' //使用emlent的错误提示
export default {
  name: 'ConsoleRole',
  data () {
    return {
      selectValue: '',
      rolePermissions:[],
      roles:[],
	  selectPermission:{
	  selectRoleName:'',
	  selectRoleId:-1,
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
  created:function(){
  	//组件创建时获取权限数据
  	this.getRoleData()
  },
  methods:{
  	getRoleData(){
  		//调用axios 获取数据
  		this.$api.role.rolePermissions().then(res=>{
  			this.rolePermissions = res.data.data
		    //并且将所有角色的角色名和角色id存到数组中去
		    for(let i of this.rolePermissions){
		       //判断如果当前角色名是商城会员 那么是不可以修改他的权限的
		       if(i.roleName === '商城会员'){
		       	continue
		       }
		      //用一个临时对象来保存一个角色的信息
		      let value = {
		        roleName:'',
		        roleId:-1
		      }
		      value.roleName = i.roleName
		      value.roleId = i.roleId
		      this.roles.push(value)
		    }
		    //设置当前selectvlaue值为权限数组的第一个
		    this.selectValue = this.roles[0].roleName
  		}).catch(error=>{
  			alertError('权限数据数据获取失败')
  		})
  	},
  	alertError(msg){
	     Message({
	      message:msg,
	      type:'error',
	      duration:5*1000
	    })
  	},
  	//重置修改内容为原来
  	resetSelect(val){
  	//判断传进来的val是否为空 如果是空代表进行重置操作
  	if(val===''){
  		val = this.selectPermission.selectRoleName
  	}
   	this.selectPermission.selectRoleName = val
  	//判断如果
  	for(let i of this.rolePermissions){
        if(i.roleName===val){
          this.selectPermission.selectRoleId = i.roleId
          this.selectPermission.userList = (i.permissionList.indexOf('user:list'))>=0
          this.selectPermission.userRole = (i.permissionList.indexOf('role:update')>=0)
          this.selectPermission.userUpdate = (i.permissionList.indexOf('user:update'))>=0
          this.selectPermission.orderList = (i.permissionList.indexOf('order:list'))>=0
          this.selectPermission.orderDelete = (i.permissionList.indexOf('order:delete'))>=0
          this.selectPermission.orderUpdate = (i.permissionList.indexOf('order:update'))>=0
          this.selectPermission.goodsList = (i.permissionList.indexOf('goods:list'))>=0
          this.selectPermission.goodsAdd = (i.permissionList.indexOf('goods:add'))>=0
          this.selectPermission.goodsUpdate = (i.permissionList.indexOf('goods:update'))>=0
          break
        }
      }	
  	},
  	//修改用户权限信息
  	updateRolePermission(){
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
  		//如果权限id为-1 说明不能提交
  		if(this.selectPermission.selectRoleId===-1){
			this.alertError('提交有误，权限id出错，联系管理员')
			return;
  		}
  		//判断角色名是否为空
  		if(this.selectPermission.selectRoleName===''){
  			this.alertError('角色名有误')
  			return;
  		}
  		//发送axios进行更新操作
  		this.$api.role.updateRolePermission({
  			roleId:this.selectPermission.selectRoleId,
  			roleName:this.selectPermission.selectRoleName,
  			permissionList:permissionList
  		}).then(res=>{
  			if(res.data.code!==200){
  				this.alertError(res.data.msg)
  			}else{
  				this.getRoleData()
				 Message({
			      message:"更新成功",
			      type:'success',
			      duration:5*1000
			    })
  			}
  		})
  	}
  },
  watch:{
  	//监听选中框的值以便于在修下面选项的值
  	selectValue:function(val){
  		this.resetSelect(val)
  	}
  }
}
</script>


<style scoped>
.el-select{
	width:20%;
	margin-left:35%;
}
.el-row{
  margin-top:5%;
  margin-left:35%;
}
.el-button{
	margin-left:10%;
	margin-top:1%;
}
#tip{
	margin-left:42%;
	margin-top:10px;
}
</style>