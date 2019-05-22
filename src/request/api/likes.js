//网站点赞的接口列表
import base from './base' //导入家口域名列表
import axios from '../util/http' //导入自定义的axios实例
const likes = {
	//获取网站的点赞数
	getLikes(){
		return axios.get(base.lo+'likes')
	},
	//对网站进行一次点赞
	giveLikes(){
		return axios.post(base.lo+'likes')
	}
}
export default likes