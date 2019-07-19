//这个是api接口的统一出口

//用户模块接口
import user from './user'
import role from './role'
import goods from './goods'
import order from './order'
import likes from './likes'
import seckill from './seckill'
//导出接口
export default {
	user,
	role,
	goods,
	order,
	likes,
	seckill
}