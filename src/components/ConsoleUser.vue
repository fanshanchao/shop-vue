<template>
  <div class="consoleUser">
    <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="用户id"
      width="180">
      <template slot-scope="scope">
        <span style="">{{ scope.row.userId }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="用户名"
      width="180">
      <template slot-scope="scope">
        <span style="">{{ scope.row.userName }}</span>
      </template>
    </el-table-column>
        <el-table-column
      label="昵称"
      width="180">
      <template slot-scope="scope">
        <span style="">{{ scope.row.nickName }}</span>
      </template>
    </el-table-column>
        <el-table-column
      label="邮箱"
      width="180">
      <template slot-scope="scope">
 <span style="">{{ scope.row.email }}</span>
      </template>
    </el-table-column>
            <el-table-column
      label="身份"
      width="180">
      <template slot-scope="scope">
 <span style="">{{ scope.row.roleName}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="状态"
      width="100">
      <template slot-scope="scope">
        <div v-if="scope.row.status ===0">
          <span style="">正常</span>
        </div>
        <div v-else>
          <span style="">被冻结</span>
        </div>
      </template>
    </el-table-column>
    <!-- 只有点击了修改用户的才可以进行修改操作 -->
    <el-table-column v-if="isContainsPermission('user:update')" label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index,scope.row.userId,scope.row.roleName)">修改身份</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleSwitch(scope.row.userId,scope.row.status)">切换状态</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
  background
  layout="prev, pager, next"
  :total="userCount"
  @current-change="goPage">
</el-pagination>
    <el-dialog
    v-if="isContainsPermission('user:update')"
    title="选择框"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
  <el-select v-model="selectValue" >
    <el-option
      v-for="item in roles"
      :key="item.roleId"
      :label="item.roleName"
      :value="item.roleName">
    </el-option>
  </el-select>
  <el-row >
    <span>用户管理:</span>
  <el-checkbox v-model="selectPermission.userList" disabled>查看用户</el-checkbox>
  <el-checkbox v-model="selectPermission.userUpdate" disabled>修改用户</el-checkbox>
  <el-checkbox v-model="selectPermission.userRole" disabled>修改权限</el-checkbox>
  </el-row>
  <el-row >
    <span>订单管理:</span>
  <el-checkbox v-model="selectPermission.orderList" disabled>查看订单</el-checkbox>
  <el-checkbox v-model="selectPermission.orderUpdate" disabled>处理订单</el-checkbox>
  <el-checkbox v-model="selectPermission.orderDelete" disabled>删除订单</el-checkbox>
  </el-row>
  <el-row>
  <span>订单管理:</span>
  <el-checkbox v-model="selectPermission.goodsList" disabled>查看商品</el-checkbox>
  <el-checkbox v-model="selectPermission.goodsAdd" disabled>添加商品</el-checkbox>
  <el-checkbox v-model="selectPermission.goodsUpdate" disabled>修改商品</el-checkbox>
  </el-row>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false;roles = [];changeInfor.userId = -1;changeInfor.roleId = -1">取 消</el-button>
    <el-button type="primary" @click="changeRole()">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui' //使用emlent的错误提示
//导入判断权限工具
import {isContainsPermission} from '../myUtil/permisssionUtil'
export default {
  name: 'ConsoleUser',
  data () {
    return {
          tableData: [],
          routerParam:'',
          page:1,
          pageSize:10,
          userCount:0,
          dialogVisible:false,
          rolePermissions:[],
          roles:[],
          selectValue:'',
          selectPermission:{
          userList:false,
          userUpdate:false,
          userRole:false,
          orderList:false,
          orderDelete:false,
          orderUpdate:false,
          goodsList:false,
          goodsAdd:false,
          goodsUpdate:false
          },
          //保存需要更改信息的用户id和角色id
          changeInfor:{
            userId:-1,
            roleId:-1
          }
      }
    },
  created:function(){
    //获取第一页的数据
    this.getTableData()
    //获取整个商城用户的数量
    this.$api.user.getUserCount().then(res=>{
      this.userCount = res.data.data
    })
  },
  methods:{
    getTableData(){
    //执行axios 获取到第一页的用户数据
    this.$api.user.getUsers({page:this.page,pageSize:this.pageSize}).then(res=>{
      this.tableData = res.data.data
    }).catch(error=>{
            Message({
              message:"用户信息获取失败，请联系管理员",
              type:'error',
              duration:5*1000
            })
    });
    },
    //跳转到当前页的方法
    goPage(val){
      this.page = val //将当前页数赋值给page
      //获取当前页的数据
      this.getTableData()
    },
    isContainsPermission:isContainsPermission,
    //用于修改用户的身份
    handleEdit(index,userId,roleName){
      //获取所有角色的权限信息
      this.$api.role.rolePermissions().then(res=>{
        this.rolePermissions = res.data.data
        //并且将所有角色的角色名和角色id存到数组中去
        for(let i of this.rolePermissions){
          //用一个临时对象来保存一个角色的信息
          let value = {
            roleName:'',
            roleId:-1
          }
          value.roleName = i.roleName
          value.roleId = i.roleId
          this.roles.push(value)
        }
      //将当前角色名赋值给selectValue 注意这里一定要等到获取到了所有权限信息再更改 否则会导致后面的watch获取不到权限信息
      this.selectValue = roleName
      //将当前用户的id赋值给data中的selectInfor中 以便于后面切换身份时用到这个id
      this.changeInfor.userId = userId
      })
      this.dialogVisible = true
    },
    //模态框的关闭处理方法
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.roles = []
            this.changeInfor.userId = -1
            this.changeInfor.roleId = -1
            done();
          })
          .catch(_ => {});
      },
      //切换身份后调用的方法
      changeRole(){
        //判断存储的需要改变的用户id是否不为-1
        if(this.changeInfor.userId!==-1){
          //通过选中的角色值去获取角色id
          let roleId = -1;
          for(let i of this.roles){
            if(i.roleName===this.selectValue){
              roleId = i.roleId
              break
            }
          }
          //当角色id也不为-1的情况下 进行axios请求 执行更新操作
          if(roleId!==-1){
            this.$api.role.roleChange({userId:this.changeInfor.userId,roleId:roleId}).then(res=>{
              //进行更新表中数据
              this.getTableData()
              //关闭模态框
              this.dialogVisible = false
            }).catch(error=>{
             Message({
              message:"错误，请联系管理员",
              type:'error',
              duration:5*1000
            })        
            })
          }else{
            Message({
              message:"错误，请联系管理员",
              type:'error',
              duration:5*1000
            })      
          }
        }else{
            Message({
              message:"错误，请联系管理员",
              type:'error',
              duration:5*1000
            })
        }
      },
      //冻结用户或解冻用户 
      handleSwitch(userId,status){
        //根据当前状态去判断去解锁还是冻结
        if(status===0){
          this.$api.user.lockUser(userId).then(res=>{
            //刷新当前表格
            this.getTableData()
          })
        }else{
          this.$api.user.unlockUser(userId).then(res=>{
            //刷新当前表格
            this.getTableData()
          })
        }
      }  
  },
  watch:{
    //监听修改身份多选框的值
    selectValue:function(val){
      //这个val的值就是当前选中的角色名
      //我们通过这个角色名去设置多选框的值
      for(let i of this.rolePermissions){
        if(i.roleName===val){
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
    }
  }
}
</script>


<style scoped>
.el-pagination{
  position:absolute;
  top:92%;
  left:50%;
}
.el-select{
  left:25%;
}
.el-row{
  margin-top:5%;
  margin-left:5%;
}
</style>