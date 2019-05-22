<template>
  <div class="main" >
    <serachComponent></serachComponent>
    <el-row >
    <el-col :span="1" :offset="14">
      <el-tag type="info"  style="margin-top:40px;">{{selectTypeName}}</el-tag>
    </el-col>
    <el-col :span="5" :offset="1" style="margin-top:40px;">
      <el-select v-model="selectValue" size="small" style="padding-left:23px;" @change="sortChange">
        <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </el-col>
</el-row>
<el-row class="goodsRow">
  <el-col :span="16" :offset="4">
    <div class="goodsList">
      <div v-for="goods in goodsData" :key="goods.goodsId" class="goodsBox">
        <router-link :to="'/showGoods/'+goods.goodsId" class="goodsLink">
          <img :src="base.image+goods.imageUrl">
          <p style="margin:0px;color:black;">{{goods.goodsName}}</p>
          <p style="color:#909399;margin:0px;">{{goods.goodsDesc.substring(0,13)+'....'}}</p>
          <p style="color:red;font-size:20px;">￥{{goods.goodsPrice}}<span style="color:black;float:right;font-size:15px;">销量：{{goods.goodsSales}}</span></p>
        </router-link>
        <el-button  class="addShopBt" size="small" @click="addGoodsToCart(goods)" round>加入购物车</el-button>
      </div>
    </div>
  </el-col>
</el-row>
  <el-pagination
  background
  layout="prev, pager, next"
  :total="goodsCount"
  :page-size="pageSize"
  @current-change="goPage">
</el-pagination>
</div>
</template>

<script>
import { Message } from 'element-ui' //使用emlent的错误提示
import { mapActions,mapGetters} from 'vuex'
//导入图片服务器地址
import base from '@/request/api/base'
import serachComponent from './Serach.vue'
export default {
  name: 'Main',
  data () {
    return {
      goodsData:[],
      base:base,
      page:1,
      pageSize:16,
      goodsTypes:[],
      selectType:{},
      options: [{
        value: 'new',
        label: '最新'
      }, {
        value: 'priceDesc',
        label: '价格由高到低'
      }, {
        value: 'priceAsc',
        label: '价格由低到高'
      },{
        value:'salesDesc',
        label:'销量最高'
      }],
      selectValue:'new',
      selectTypeId:0,
      goodsCount:0,
      selectTypeName:'全部商品'
    }
  },
  created:function(){
    //如果是检索出来的商品信息 就去获取检索出来的商品
    if(this.$route.params.searchValue){
      this.searchGoods()
      //设置当前标签是搜索的关键字的
      this.selectTypeName = '关键字为:'+this.$route.params.searchValue+'的商品'
    }else{
      //判断当前页面跳转是否有参数 如果有就赋值selectTypeId
      if(this.$route.params.typeId){
        //获取分类信息 最好不管用不用都把它获取到吧 避免以后还要使用
        this.getGoodsTypes()
        this.selectTypeId = this.$route.params.typeId
        //并且获取这个分类和排序的商品信息
        this.getGoodsDataByType(this.page)
      }else{
        //否则获取正常的全部商品
        this.getGoodsData(this.page)
      }
      //获取当前分类商品的数量
      this.getGoodsCountByType(this.selectTypeId)
      //设置分类的标签
      this.setGoodsTag(this.selectTypeId)
    }
  }
  ,
  methods:{
   getGoodsTypes(){
    this.$api.goods.getGoodsTypes().then(res=>{
     this.goodsTypes = res.data.data
     this.setGoodsTag(this.selectTypeId)
   })
  },
  //获取所有商品的信息 根据页数
  getGoodsData(page){
    //创建页面时去获取第一页的商品信息
      this.$api.goods.getGoods({
        page:page,
        pageSize:this.pageSize
      }).then(res=>{
        //将获取到的数据赋值给表格
        this.goodsData = res.data.data
      }).catch(error=>{
        this.errorTip("数据获取失败，请联系管理员")
      })
  },
  //获取某种分类某种排序的
  getGoodsDataByType(page){
    this.$api.goods.getGoodsByType({
      page:page,
      pageSize:this.pageSize,
      typeId:this.selectTypeId,
      sortName:this.selectValue
    }).then(res=>{
      this.goodsData = res.data.data
    }).catch(error=>{
      this.errorTip("数据获取失败，请联系管理员")
    })
  },
  errorTip(msg){
    Message({
      message:msg,
      type:'error',
      duration:5*1000
    })
  },
  //排序方式变化触发的函数 
  sortChange(val){
    //根据当前排序去获取商品信息 并且要把当前所在页数置为1
    this.page = 1
    //判断是否是检索商品的
    if(this.$route.params.searchValue){
      //注意这里非常重要要先把数组给置空 因为前面数组中的值是push进去的
      this.goodsData = []
      //搜索商品的信息
      this.searchGoods()
    }else{
      this.getGoodsDataByType(this.page)
    }
    
  },
  //获取某个分类商品的数量
  getGoodsCountByType(typeId){
    this.$api.goods.getGoodsCountByType(typeId).then(res=>{
      this.goodsCount = res.data.data
    })
  },
  //跳转到某一页
  goPage(val){
    this.page = val
    //判断是否是检索到的商品信息
    if(this.$route.params.searchValue){
      //从elasticsearch中去搜索商品信息
      this.searchGoods()
    }else{
      //获取当前分类当前页的数据
      this.getGoodsDataByType(this.page)
    }
  },
  //设置当前商品类型标签
  setGoodsTag(typeId){
    for(let i = 0;i < this.goodsTypes.length;i++){
      //注意这里由于typeId传进来的是字符串 所以用==比较才会相等
      if(this.goodsTypes[i].typeId==typeId){
        this.selectTypeName = this.goodsTypes[i].typeName
        break
      }
    }
  },
  //添加商品到购物车中去
  addGoodsToCart(goods){
    //如果购物车中已经有20个商品 那么不能继续添加
    if(this.getCartsLength===20){
      this.open5()
      return
    }
    this.addGoodsAsync({
      goodsId:goods.goodsId,
      imageUrl:goods.imageUrl,
      goodsName:goods.goodsName,
      goodsPrice:goods.goodsPrice,
      summary:goods.goodsPrice,
      goodsRepertory:goods.goodsRepertory,
      num:1,
    }).then(()=>{
      this.open3()
    })
  },
  ...mapActions('carts',['addGoodsAsync']),
    open3() {
    this.$notify({
      title: '成功',
      message: '添加成功！',
      type: 'success',
      duration:1000
    });
  },
    open5() {
    this.$notify.error({
      title: '错误',
      message: '购物车已满，请清理购物车后再添加',
      duration:1000
    });
  },
  //根据某个搜索值去获取商品
  searchGoods(){
    //根据所选排序去构建一个排序对象
    let sortVlaue
    if(this.selectValue==='new'){
      sortVlaue = {"goodsId":"desc"}
    }else if(this.selectValue==='priceDesc'){
      sortVlaue = {"goodsPrice":"desc"}
    }else if(this.selectValue==='priceAsc'){
      sortVlaue = {"goodsPrice":"asc"}
    }else{
      //按销量来
      sortVlaue = {"goodsSales":"desc"}
    }
    //进行检索商品操作
    this.$api.goods.searchGoods({
      searchValue:this.$route.params.searchValue,
      pageStart:(this.page-1)*this.pageSize,
      pageSize:this.pageSize,
      sortValue:sortVlaue
    }).then(res=>{
      //将检索到的商品信息赋值给goodsData 由于数据是在hits数组里面 然后数组里面又有不同 所以数据需要重新加入到goodsData中去
      for(let i of res.data.hits.hits){
        this.goodsData.push(i._source)
      }
      console.log(res.data.hits.hits)
      console.log(this.goodsData)
      //并且将检索到的商品数量赋值给goodsCount
      this.goodsCount = res.data.hits.total
    }).catch(error=>{
      this.$message.error('搜索商品失败，请联系管理员')
    })
  }
},
watch:{
    '$route'(to, from) {
      //判断要去的路由是否有商品分类id 如果有就获取当前分类的信息
      if(to.params.typeId){
        //当前页数也要置为1 
        this.page = 1
        //当前分类id切换
        this.selectTypeId = to.params.typeId
        this.getGoodsDataByType(this.page)
        //设置当前分类的标签
        this.setGoodsTag(this.selectTypeId)
      }else if(this.$route.params.searchValue){
        //注意这里非常重要要先把数组给置空 因为前面数组中的值是push进去的
        this.goodsData = []
        //如果是搜索出来的商品信息 
        this.page = 1
        //设置当前
        this.selectTypeName = '关键字为:'+this.$route.params.searchValue+'的商品'
        //检索商品
        this.searchGoods()
      }else{
        //当前页数置为1
        this.page = 1
        //当前标签设置为全部商品
        this.selectTypeName = '全部商品'
        //获取正常的商品信息
        this.getGoodsData(this.page)
      }
    }
  },
  components:{serachComponent},
  computed:{
    ...mapGetters('carts',['getCartsLength'])
  }
}
</script>

<style scoped>
.gooodsLink:hover{
  border-style:solid;
  border-width:1px;
  border-color:transparent;
}
.goodsBox{
  width:25%;
  float:left;
  height:400px;
  display:inline;
  box-sizing:border-box;
  border-style: solid;
  border-color:#FFFFFF;
  border-width:0.7px;
  padding:10px 9px 10px 10px;
}
img{
  width:100%;
  height:215px;
}
.goodsBox:hover{
  border-color:#DCDFE6;
}
.goodsRow{
  margin-top:30px;
}
a:visited{
  color:blue;
}
.addShopBt{
  color:#606266;
  float:right;
}
.el-pagination{
    margin-left:73%;
    margin-top:3%;
}
</style>