<template>
  <div class="userOrder">
  <headComponent></headComponent>
  <serach></serach>
  <el-row>
  	<el-col :span="20" :offset="2">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="全部订单"   name="-1"></el-tab-pane>
    <el-tab-pane label="待付款订单" name="0"></el-tab-pane>
    <el-tab-pane label="待发货订单" name="1"></el-tab-pane>
    <el-tab-pane label="待收货订单" name="2"></el-tab-pane>
    <el-tab-pane label="已完成订单" name="3"></el-tab-pane>
  </el-tabs>
      <el-table
    :data="tableData"
    style="width: 100%;">
    <el-table-column type="expand">
      <template slot-scope="props">
          <span class="title">收货人信息：</span><span>{{ props.row.receiverName }}，{{props.row.mobile}}</span>
          <br/><br/>
          <span class="title">收货地址：</span><span>{{ props.row.address }}</span>
          <br/><br/>
          <span class="title">买家留言：</span><span>{{ props.row.message }}</span>
          <br/><br/>
          <br/>
      <el-table
      :data="props.row.resultOrderGoods"
      style="width: 100%">
      <el-table-column
        prop="goodsName"
        label="商品名称"
        >
      </el-table-column>
      <el-table-column
        prop="imageUrl"
        label="商品主图"
        >
        <template slot-scope="scope">
          <img :src="base.image+scope.row.imageUrl">
        </template>
      </el-table-column>
      <el-table-column
        label="商品单价">
        <template slot-scope="scope">
          {{scope.row.goodsPrice/scope.row.goodsNumber}}
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsNumber"
        label="商品数量">
      </el-table-column>
      <el-table-column
        prop="goodsPrice"
        label="商品总价">
      </el-table-column>
    </el-table>
    <br/>
    <div style="margin-left:77%">
      <span class="title">订单总价：</span>
      <span style="color:red;">￥{{ props.row.payMoney }}</span> 
    </div>
      </template>
    </el-table-column>
    <el-table-column
      label="订单id"
      prop="orderId"
      width="100px">
    </el-table-column>
        <el-table-column
      label="创建时间"
      prop="createDate">
      <template slot-scope="props">
        {{ dateFormat(props.row.createDate) }}
      </template>
    </el-table-column>
            <el-table-column
      label="付款时间">
       <template slot-scope="props">
        {{ dateFormat(props.row.payDate) }}
      </template>
    </el-table-column>
        <el-table-column
      label="发货时间">
             <template slot-scope="props">
        {{ dateFormat(props.row.deliveryDate) }}
      </template>
    </el-table-column>
     <el-table-column
      label="完成时间">
     <template slot-scope="props">
        {{ dateFormat(props.row.confirmDate) }}
      </template>
    </el-table-column>
        <el-table-column
      label="订单状态"
      width="100px">
      <template slot-scope="props">
      <span v-if="props.row.status ===0" style="color:#409EFF">
        未付款
      </span>
      <span v-else-if="props.row.status ===1" style="color:#E6A23C">
        未发货
      </span>
       <span v-else-if="props.row.status ===2" style="color:#080808">
        已发货
      </span>
      <span v-else-if="props.row.status ===3" style="color:#67C23A;">
        已完成
      </span>
      <s v-else-if="props.row.status ===4" style="color:#909399;">
        已关闭
      </s>
      </template>
    </el-table-column>
         <el-table-column
      label="订单金额"
      width="100px">
      <template slot-scope="props">
        <span style="color:red;">{{ props.row.payMoney }}元</span>  
      </template>
    </el-table-column>
        <el-table-column label="操作">
      <template  slot-scope="scope">
        <el-button
          size="mini"
          v-if="scope.row.status===0"
          @click="handleDelete(scope.row.orderId)">取消</el-button>
          <router-link
          :to="/payMoney/+scope.row.orderId"
          v-if="scope.row.status===0">
          <el-button
          size="mini"
          type="danger"
          @click="handlePay(scope.row.orderId)">去支付</el-button>
          </router-link>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
  background
  layout="prev, pager, next"
  :total="ordersCount"
  :page-size="pageSize"
  @current-change="goPage">
</el-pagination>
  	</el-col>
  </el-row>
  <footerComponent ></footerComponent>
  </div>
</template>

<script>
//导入head组件
import headComponent from './Head.vue'
//导入main组件
import serach from './Serach.vue' 
//导入footer组件
import footerComponent from './Footer.vue'
//导入时间格式化工具
import {dateFormat} from '../myUtil/dateUtil'
//导入图片服务器地址
import base from '@/request/api/base'
export default {
  name: 'UserOrder',
  data () {
    return {
       activeName:'-1',
       tableData: [],
       page:1,
       pageSize:5,
       ordersCount:0,
       base:base,
    }
  },
  components:{headComponent,serach,footerComponent},
  methods:{
    //选择订单分类触发的按钮
    handleClick(tab){
      //this.activeName = tab.name
      //跳转并获取某一分类的订单
      this.$router.push({path:tab.name})
      //this.getTableData()
      //this.getUserOrdersCount()
    },
    //获取订单列表的数据
    getTableData(){
      let status
      //判断是获取全部订单还是某一种分类的订单
      if(this.activeName!=='-1'){
        status = this.activeName
      }
      console.log('获取数据之前的status'+status)
      //获取某种类型的订单
      this.$api.order.getUserOrders({
        page:this.page,
        pageSize:this.pageSize,
        status:status
      }).then(res=>{
        this.tableData = res.data.data
      }).catch(error=>{
        this.$message.error('订单数据获取失败，请联系管理员');
      })   
    },
    //获取当前类型订单的数量
    getUserOrdersCount(){
      let status
      console.log(this.activeName!=='-1')
      //判断是获取全部订单还是某一种分类的订单
      if(this.activeName!=='-1'){
        status = this.activeName
      }
      console.log(status)
      this.$api.order.getUserOrdersCount(status).then(res=>{
        this.ordersCount = res.data.data
      }).catch(error=>{
        this.$message.error('订单数据获取失败，请联系管理员');
      })
    },
    //跳转到某一页
    goPage(val){
      this.page = val
      //获取数据
      this.getTableData()
    },
    dateFormat:dateFormat,
    //取消一个订单
    handleDelete(orderId){
      this.$api.order.cancelOrders(orderId).then(res=>{
        if(res.data.data!==200){
          this.$message.error(res.data.msg);
          return
        }
        this.$message.success('取消成功');
      }).catch(error=>{
        this.$message.error('订单取消失败，请联系管理员');
      })
    }
  },
  created:function(){
    //获取当前订单类型的第一页数据 类型根据路由参数判断
    this.activeName = this.$route.params.orderType
    //获取数据
    this.getTableData()
    //获取订单数量
    this.getUserOrdersCount()
  },
  watch:{
    //监听路由以获取路由信息 路由跳转时获取数据 必须监听 否则路由跳转过来的不会获取最新数据
    '$route'(to,from){
      console.log(to.params.orderType)
      this.activeName = to.params.orderType
      this.getTableData()
      this.getUserOrdersCount()
      //非常重要的一点 重置当前页数
      this.page = 1
    }
  }
}
</script>


<style scoped>
img{
  width:50px;
  height:50px;
}
.el-row{
  margin-top:40px;
}
.el-pagination{
  margin-left:45%;
  margin-top:3%;
}
</style>