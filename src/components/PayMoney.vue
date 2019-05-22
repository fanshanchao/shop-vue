<template>
  <div class="payMoney">
  	<headComponent></headComponent>
  	<el-row>
  		<el-col :span="6" :offset="10">
  			<span style="color:#C0C4CC;font-size:15px;">订单编号:{{this.$route.params.orderId}}</span><p style="color:#67C23A;">您的订单已经提交成功，请付款..........</p>
        <h4>需支付：￥<span style="color:red;font-size:30px;">{{orderMoney}}</span></h4>
        <img src="/static/images/5555.jpg"><br/><br/>
         <el-button type="danger" style="margin-left:60px;" @click="payOrder">点击付款</el-button>
  		</el-col>  
  	</el-row>
  	<footerComponent style="margin-top:20px;"></footerComponent>
  </div>
</template>

<script>
//导入head组件
import headComponent from './Head.vue'
//导入footer组件
import footerComponent from './Footer.vue'
export default {
  name: 'PayMoney',
  data () {
    return {
      //获取当前订单的id 从路由中获取
      orderMoney:0.00
    }
  },
  components:{headComponent,footerComponent},
  created:function(){
    //查询当前订单的状态 如果是已付款或者不存在就跳转首页
    this.$api.order.getStatus(this.$route.params.orderId).then(res=>{
      //如果返回数据为null 或订单已支付或者已取消 跳转回首页 并返回错误信息
      if(res.data.data!==0||res.data.data===null){
        //请求错误可能是传参出错 也跳转回首页
        this.$message.error('订单不存在或已支付');
        this.$router.replace({path:'/'})
      }
    }).catch(error=>{
      //请求错误可能是传参出错 也跳转回首页
      this.$message.error('操作异常，联系管理员');
      //this.$router.replace({path:'/'})
    })
    //获取当前订单的价格
    this.$api.order.getMoney(this.$route.params.orderId).then(res=>{
      this.orderMoney = res.data.data
    }).catch(error=>{
      this.$message.error('价格获取失败，联系管理员');
    })
  },
  methods:{
    payOrder(){
      this.$api.order.payOrder(this.$route.params.orderId).then(res=>{
        if(res.data.code!==200){
          this.$message.error(res.data.data);
        }else{
          //跳转到支付成功页面
          this.$router.replace({name:'paySuccess', params: { orderId:this.$route.params.orderId}})
        }
      }).catch(error=>{
        this.$message.error('操作异常，请联系管理员');
      })
    }
  }
}
</script>


<style scoped>

</style>