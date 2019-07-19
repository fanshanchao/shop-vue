import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import NotFound from '@/components/NotFound'
import Register from '@/components/Register'
//使用了路由懒加载
const Console = ()=>import('@/components/Console')
const ConsoleUser = ()=>import('@/components/ConsoleUser')
const ConsoleMain = ()=>import('@/components/ConsoleMain')
const ConsoleRole = ()=>import('@/components/ConsoleRole')
const ConsoleAddRole = ()=>import('@/components/ConsoleAddRole')
const ConsoleGoods = ()=>import('@/components/ConsoleGoods')
const ConsoleAddGoods = ()=>import('@/components/ConsoleAddGoods')
const ConsoleOrders = ()=>import('@/components/ConsoleOrders')
const Goods = ()=>import('@/components/Goods')
const ShoppingCart = ()=>import('@/components/ShoppingCart')
const PayOrder = ()=>import('@/components/PayOrder')
const PayMoney = ()=>import('@/components/PayMoney')
const PaySuccess = ()=>import('@/components/PaySuccess')
const UserOrders = ()=>import('@/components/UserOrders')
const Seckill = ()=>import('@/components/Seckill')
const SeckillDetail = ()=>import('@/components/SeckillDetail')
const AddSeckill = ()=>import('@/components/AddSeckill')
Vue.use(Router)

//注意这里将默认路由的数组给导出去
export  const constantRouterMap = [
    {
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path:'/shoppingCart',
        name:'shoppingCart',
        component:ShoppingCart
    },
    {
      path:'/type/:typeId',
      name:'GoodsType',
      component:Index
    },
    {
      path:'/search/:searchValue',
      name:'searchGoods',
      component:Index
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path:'/register',
        name:'Register',
        component:Register
    },
    {
        path:'/showGoods/:goodsId',
        name:'showGoods',
        component:Goods
    },
    {
        path:'/seckill',
        name:'seckill',
        component:Seckill
    }
  ]
//这些路由都是没有登陆情况下可以访问的路由
export default new Router({
  routes:constantRouterMap,
  //mode:"history"
})

//下面定义一些需要权限才可以访问的页面 需要异步挂载的路由
//meta里面定义了需要的权限 并且child里面定义了哪些子路由需要什么权限才可以加载 注意这里的meta里面的role是不能进入的
export const asyncRouterMap = [
{
  path:'/console',
  component:Console,
  name:'console',
  meta:{
    //注意这里是只要权限名等于商城会员那么就进不去这个管理页面
    role:['商城会员']
  },
  redirect:'/console/main',
  children:[
    {
      path:'main',
      component:ConsoleMain,
      name:'consoleMain'
    },
    {
      path:'user',
      component:ConsoleUser,
      name:'consoleUser',
      meta:{
        hasPermission:'user:list'
      }
    },
    {
      path:'role',
      component:ConsoleRole,
      name:'consoleRole',
      meta:{
        hasPermission:'role:update'
      }
    },
    {
      path:'addRole',
      component:ConsoleAddRole,
      name:'addRole',
      meta:{
        hasPermission:'role:update'
      }
    },
    {
      path:'goods',
      component:ConsoleGoods,
      name:'goods',
      meta:{
        hasPermission:'goods:list'
      }
    },{
      path:'addGoods',
      component:ConsoleAddGoods,
      name:'addGoods',
      meta:{
        hasPermission:'goods:add'
      }
    },{
      path:'addSeckill',
      component:AddSeckill,
      name:'addSeckill',
      meta:{
        hasPermission:'goods:add'
      }
    },
      {
      path:'orders',
      component:ConsoleOrders,
      name:'orders',
      meta:{
        hasPermission:'order:list'
      }
    },
    {
      path:'dealOrders',
      component:ConsoleOrders,
      name:'dealOrders',
      meta:{
        hasPermission:'order:update'
      }
    }
  ]
},
  { 
    path:'/payOrder',
    component:PayOrder,
    name:'payOrder'
  },
  {
    path:'/payMoney/:orderId',
    component:PayMoney,
    name:'payMoney'
  },
  {
    path:'/paySuccess',
    component:PaySuccess,
    name:'paySuccess'
  },
  {
    path:'/userOrders/:orderType',
    component:UserOrders,
    name:'userOrders'
  },
  {
    path:'/seckill/:seckillId',
    component:SeckillDetail,
    name:'seckillDetail'
  },
  {
  path:'*',
  name:'NotFound',
  component:NotFound
  }
];
//返回一个白名单路由 就是可以直接访问的路由 
//export const whiteList = ['/','/login','/register']
