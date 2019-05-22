import axios from 'axios'//引入axios
import QS from 'qs'//引入qs模块，用来序列化post类型的数据
import { Message } from 'element-ui' //使用emlent的错误提示

import router from '@/router/index'
import store from '@/store/index' //引入store
//参考网上大佬优化过后的 更加方便模块化开发


/*封装一个提示函数*/
const tip = msg =>{
		Message({
			message:msg,
			type:'error',
			duration:5*1000
		})
}
/*跳转登录页
*携带当前页面路由，以期在登陆页面完成后返回当前页面
*/
const toLogin = () =>{
	router.replace({
		path:'/login',
		query:{
			redirect:router.currentRoute.fullPath//这里将当前router传过去 登陆成功后返回到当前路径
		}
	})
}
/*
*请求返回错误码后的错误统一处理
*/
const errorHandle = (status)=>{
	//状态码判断
	switch(status){
		//没有登陆
		case 422:
			tip("没有登陆请重新登陆")
			setTimeout(function() {
				toLogin();
			}, 3000);
			break;
		//没有权限 登陆后验证身份
		case 403:
			tip("没有权限，请登陆后验证身份");
			setTimeout(function() {
				toLogin();
			}, 3000);
			break;
	}
}

//创建axios实例
const instance = axios.create({});

//请求拦截器
instance.interceptors.request.use(
	config=>{
		//判断vuex中是否有token  注意这里获取store中的token是通过引入store 再通过引入token值获取的
		if(store.state.user.token!==''){
			//放入请求头中
			config.headers.Authorization = store.state.user.token;
			//config.headers.Content-Type = 'application/json'
		}
		return config
	},
	error=>{
		return  Promise.reject(error)
	})

//定义一个响应拦截器
instance.interceptors.response.use(
	res=>{
		//调用返回码处理器
		errorHandle(res.data.code)
		return Promise.resolve(res)
	},
	err=>{
		return Promise.reject(err)
	})
//导出instance
export default instance;




//优化前的写法
// //设置axios的默认请求头和默认请求时间
// axios.defaults.timeout = 3000;
// //请求拦截
// axios.interceptors.request.use(
// 	config=>{
// 		//每次发送前判断vuex中是否有token 这里先省略...后续学了vuex完善

// 	},error=>{
// 		return Promise.error(error);
// 	});
// //响应拦截
// axios.interceptors.response.use(
// 	response=>{
// 		if(response.code===422||response.code===403){
// 		//没登陆则跳转到登陆页面
// 		router.push({
// 			path:'/login',
// 			querry:{redirect:router.currentRoute.fullPath}
// 		})
// 	}
// 	return Promise.resolve(response);
// 	},
// 	error=>{
// 	//使用element的错误提示
// 		Message({
// 			Message:error.message,
// 			type:'error',
// 			duration:5*1000
// 		})
// 		resolve Promise.reject(error)
// 	})
// //封装4个方法
// export function get(url,params){
// 	return new Promise((resolve,reject)=>{
// 		axios.get(url,{
// 			params:params
// 		}).then(res=>{
// 			resolve(red.data);
// 		}).catch(err=>{
// 			reject(err.data)
// 		})
// 	})
// }
// //QS模块就是用来序列化post的对象的
// export function post(url,params){
// 	return new Promise((resolve,reject)=>{
// 		axios.post(url,QS.stringify(params))
// 		.then(res=>{
// 			resolve(res.data)
// 		}).catch(err=>{
// 			reject(err.data)
// 		})
// 	})
// }