<template>
  <div class="footer">
  	<el-row style="height:100%;">
  		<el-col :span="4" :offset="10" style="height:100%;">
  			<div style="height:100%;margin-top:20%;text-align:center;margin-bottom:20%;">
  				<el-button type="text"><a :href="base.github"><svg class="footIcon" aria-hidden="true"><use xlink:href="#icon-github-fill"></use></svg></a></el-button>
  				<el-tooltip content="1049709821" placement="top" effect="light">
  				<el-button type="text"><svg class="footIcon" aria-hidden="true"><use xlink:href="#icon-QQ-circle-fill"></use></svg></el-button>
  				</el-tooltip>
    			<el-button  type="text" @click="giveLikes"><svg v-if="!isGive" class="footIcon" aria-hidden="true"><use xlink:href="#icon-like"></use></svg><svg v-else class="footIcon" aria-hidden="true"><use xlink:href="#icon-dianzan_kuai"></use></svg></el-button>
          <p style="color:#909399;">已被点赞{{likeTimes}}次</p>
  			</div>
  		</el-col>
  	</el-row>
  </div>
</template>

<script>
import base from '@/request/api/base'
export default {
  name: 'Footer',
  data () {
    return {
      likeTimes:0,
      isGive:false,
      base:base
    }
  },
  created:function(){
    //发送axios请求获取网站点赞数
    this.$api.likes.getLikes().then(res=>{
      this.likeTimes = res.data.data
    }).catch(error=>{

    })
  },
  methods:{
    //进行一次点赞的函数
    giveLikes(){
      //如果已经点赞过了则不可以继续点赞
      if(this.isGive){
        this.$message.info('你已经点过赞了')
        return
      }
      //发送axios请求获取网站点赞数
      this.$api.likes.giveLikes().then(res=>{
        //对点赞数进行累加操作
        this.likeTimes++;
        this.isGive = true
      }).catch(error=>{
        this.$message.error('点赞失败，稍后再试')
      })
    }
  }
}
</script>


<style scoped>
.footer{
	height:150px;
  margin-top:30px;
	border-top-style:solid;
	border-top-width:1px;
	border-top-color:#EBEEF5;
}
.el-row{
}
.footIcon{
	width: 4em; 
	height: 4em;
}
</style>