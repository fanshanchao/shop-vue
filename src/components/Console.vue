<template>
  <div class="console">
<el-container >
  <el-aside width="15%">
    <consoleAside></consoleAside>
  </el-aside>
  <el-container>
    <el-header height="6%"><consoleHeader></consoleHeader></el-header>
    <el-main><router-view></router-view></el-main>
  </el-container>
</el-container>
  </div>
</template>

<script>
import consoleAside from './ConsoleAside'
import consoleHeader from './ConsoleHeader'
export default {
  name: 'Console',
  data () {
    return {
      msg: '后台管理中心'
    }
  },
  components:{
    consoleAside,
    consoleHeader}
}
</script>
<style scoped>
.el-main{
  height:5px;
}
.el-el-container{
  margin:0;
  padding:0;
}
.el-header{
  margin:0px;
  padding:0px;
}
</style>