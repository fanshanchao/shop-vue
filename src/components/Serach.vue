<template>
  <div class="serach">
  	  	<el-row class="mainHeader">
  		<el-col :span="1" :offset="1">
  			<a :href="base.github"><svg  class="gitHubIcon" aria-hidden="true"><use xlink:href="#icon-github-fill"></use></svg></a>	
  		</el-col>
  		<el-col :span="13" :push="4">
        <el-button v-for="type in goodsTypes" v-bind:selectType="type" v-bind:key="type.typeId" class="typeBt" type="text" @click="typeBt(type.typeId)"><h1 class="typeH1">{{type.typeName}}</h1></el-button>
      </el-col>
      <el-col style="float:right;" :span="1">
        <el-button style="background-color:#DCDFE6;margin-top:10px;" @click="searchGoods"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-search"></use></svg></el-button>
      </el-col>
      <el-col style="float:right;" :span="4">
       <el-input style="margin-top:10px;" v-model="searchValue" placeholder="请输入内容"></el-input>
     </el-col>
   </el-row>
  </div>
</template>

<script>
import base from '@/request/api/base'
export default {
  name: 'Serach',
  data () {
    return {
      selectValue:'new',
      selectTypeId:0,
      goodsTypes:[],
      searchValue:'',
      base:base
    }
  },
  created:function(){
  	this.getGoodsTypes()
    //判断是否有搜索参数 如果有将值赋值给searchValue
    if(this.$route.params.searchValue){
      this.searchValue = this.$route.params.searchValue
    }
  },
  methods:{
	   getGoodsTypes(){
	    this.$api.goods.getGoodsTypes().then(res=>{
	     this.goodsTypes = res.data.data
	   })
	  },
	//点击分类按钮触发的函数
	typeBt(typeId){
		//跳转到某个分类
    this.$router.push('/type/'+typeId)
	},
  //根据指定值搜索商品的函数
  searchGoods(){
    if(this.searchValue.length===0){
        this.$message.error('搜索值为空');
        return
    }
    //跳转到首页 首页会根据传的值进行搜索商品的
    this.$router.push('/search/'+this.searchValue)
  }
  }
}
</script>


<style scoped>
.gitHubIcon{
	width: 3em; height: 3em;
	margin-top:0.4em;
}
.mainHeader{
	border-bottom-style:solid;
	border-bottom-width:1px;
	border-bottom-color:#EBEEF5;
	height:60px;
}
.typeBt{
	color:black;
	padding:0px;
	margin-left:20px;
}
</style>