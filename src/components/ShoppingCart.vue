<template>
  <div class="shoppingCart">
  	<headComponent></headComponent>
    <br/>
  	<el-row style="height:100%;">
  		<el-col :span="16" :offset="4">
        <div v-if="getCarts.length===0" style="height:200px;text-align:center;margin-top:150px;">
          <p>你的购物车空空如也~</p>
          <router-link to="/"><el-button style="margin-right:10px;" type="danger">去挑选商品</el-button></router-link>
        </div>
        <div v-else>
                  <span style="color:#909399;">hi，欢迎来到你的购物车（购物车是用vuex做的状态管理，所以刷新或者关闭浏览器购物车数据就会清空）</span>
        <el-button style="float:right"  size="small" type="danger" @click="payOrder()">去下单</el-button>
      <router-link to="/">
        <el-button style="float:right;margin-right:10px;"  size="small"  plain>继续购物</el-button>
      </router-link>
              <el-table
    ref="multipleTable"
    :data="getCarts"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
     <el-table-column
      label="商品"
     >
      <template slot-scope="scope">
        <el-row style="">
        <el-col :span="6">
          <img :src="base.image+scope.row.imageUrl">
        </el-col>
        <el-col :span="18">
          <p style="color:black;"><router-link :to="'/showGoods/'+scope.row.goodsId">{{scope.row.goodsName}}</router-link></p>  
        </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column
      label="售价"
      width="120">
      <template slot-scope="scope"><span>￥{{scope.row.goodsPrice}}</span></template>
    </el-table-column>
    <el-table-column
      label="购买数量"
      width="200">
      <template slot-scope="scope">
        <el-input-number v-model="scope.row.num" @change="changeNums($event,scope.row.goodsId)" :min="1" :max="scope.row.goodsRepertory" size="mini"></el-input-number></template>
    </el-table-column>
    <el-table-column
      label="小计"
      width="120">
      <template slot-scope="scope"><span style="color:red;font-size:15px;">￥{{scope.row.summary.toFixed(2)}}</span></template>
    </el-table-column>
     <el-table-column label="操作"  width="120">
      <template slot-scope="scope">
        <el-button
        class="deleteBt"
          size="mini"
          type="text"
          @click="deleteGoods(scope.row.goodsId)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top: 20px">
    <el-button  class="deleteBt" type="text" size="mini" @click="deleteGoods()">删除勾选商品</el-button>
    <el-button class="deleteBt" icon="el-icon-delete" type="text" size="mini" @click="clearCartsAsync()">清空购物车</el-button>
    <span style="float:right;">{{selectGoodsNum}}件商品，总价：<span style="color:red;float:right;">￥{{totalMoney.toFixed(2)}}</span></span>
  </div>
  <br/>
   <router-link to="/">
    <el-button  plain>继续购物</el-button></router-link>
    <el-button style="float:right" type="danger" @click="payOrder()">去下单</el-button>
        </div>
  	</el-col>
  	</el-row>
  	<footerComponent style="margin-top:30px;"></footerComponent>
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
  name: 'ShoppingCart',
  data () {
    return {
        multipleSelection: [],
        base:base
    }
  },
  components:{headComponent,footerComponent},
  created:function(){
  	//先模拟从后台获取商品信息吧
  	// this.$api.goods.getGoods({page:1,pageSize:4}).then(res=>{
  	// 	this.tableData = res.data.data
  	// })
  },
  methods:{
    //选择商品列表触发的函数
  	handleSelectionChange(val){
      //将选中的值赋值给 multipleSelection
      this.multipleSelection = val
  	},
    //商品数量改变触发的函数
    changeNums(val,goodsId){
      //更改购物车的数量
      this.updateGoodsAsync({
        goodsId:goodsId,
        num:val
      })
    },
    //删除一个或一些商品的函数
    deleteGoods(num){
      let nums = []
      //判断是否传入了参数 如果传了代表是删除一个商品
      if(num){
        //执行删除操作
        nums.push(num)
      }else{
        //否则将选中的商品id 添加到删除商品id数组中
        for(let i of this.multipleSelection){
          nums.push(i.goodsId)
        }
      }
      this.deleteGoodsAsync(nums)
    },
    //支付商品的函数
    payOrder(){
      //判断是否选中商品
      if(this.multipleSelection.length===0){
        this.$message.error('未选择商品');
        return 
      }
      //判断用户是否登陆 未登陆跳转到登陆页面
      if(!this.getToken){
        this.$router.push({
          path:'/login',
          query: {redirect:this.$route.path}
        })
        return
      }
      //先将选中的商品信息添加到vuex中
      this.addPayCartsAsync(this.multipleSelection)
      //用户已登录 跳转到订单页面 
      this.$router.push({
        path:'/payOrder'
      })
    },
    ...mapActions('carts',['updateGoodsAsync','deleteGoodsAsync','clearCartsAsync','addPayCartsAsync'])
  },
  computed:{
    ...mapGetters('carts',['getCarts']),
    ...mapGetters('user',['getToken']),
    //监听订单购物车总金额
    totalMoney:function(){
      if(this.multipleSelection.length==0){
        return 0.00
      }
      let total = 0.00;
      for(let i of this.multipleSelection){
        total = total+i.summary
      }
      return total
      },
      //监听所有选中商品数量
      selectGoodsNum:function(){
        if(this.multipleSelection.length==0){
          return 0+''
        }
        let total = 0;
        for(let i of this.multipleSelection){
          total += i.num
        }
        return total
      }
    }
}
</script>
<style scoped>
img{
	width:60px;
	height:60px;
}
.deleteBt{
	color:#909399;
}
</style>