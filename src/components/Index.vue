<template>
  <div class="index">
    <el-container>
  <el-header style="height:auto;"><headComponent></headComponent></el-header>
  <el-main style="margin-top:0px;padding:0px;"><mainComponent></mainComponent></el-main>
  <el-footer style="height:130px;margin-top:3%;"><footerComponent></footerComponent></el-footer>
</el-container>
    
  </div>
</template>

<script>
//导入head组件
import headComponent from './Head.vue'
//导入main组件
import mainComponent from './Main.vue' 
//导入footer组件
import footerComponent from './Footer.vue'
export default {
  name: 'index',
  data () {
    return {
    }
  },
  components:{headComponent,mainComponent,footerComponent}
}
</script>
<style scoped>
</style>