<template>
  <div class="paySuccess">
  	<headComponent></headComponent>
  	<el-row style="height:400px;margin-top:20px;">
  		<el-col :span="6" :offset="9">
		  <el-alert
		    title="支付成功"
		    type="success"
		    :closable="false"
		    show-icon>
		  </el-alert>
		  <br/>
		  <div style="margin-top:100px;text-align:center;">
		  <router-link to="/userOrders/1"><el-button type="info"  round>查看订单</el-button></router-link>
		  </div>
  		</el-col>
  	</el-row>
  	<footerComponent></footerComponent>
  </div>
</template>

<script>
//导入head组件
import headComponent from './Head.vue'
//导入footer组件
import footerComponent from './Footer.vue'
export default {
  name: 'PaySuccess',
  data () {
    return {

    }
  },
  components:{headComponent,footerComponent},
  created:function(){
  	//获取订单的参数 如果为空就跳转去首页
  	if(!this.$route.params.orderId){
  		 this.$router.replace({path:'/'})
  	}
  }
}
</script>
<style scoped>

</style>