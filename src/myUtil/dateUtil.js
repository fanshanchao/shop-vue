//用来格式化date的工具
function add0(m){return m<10?'0'+m:m }
export function dateFormat(time){
	//判断时间是否为空 如果是返回一个空值
	if(!time){
		return '-'
	}
	var date = new Date(time)
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var d = date.getDate();
	var h = date.getHours();
	var mm = date.getMinutes();
	var s = date.getSeconds();
	return y+'/'+add0(m)+'/'+add0(d)+' '+add0(h)+":"+add0(mm)+":"+add0(s);
}