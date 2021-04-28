function add0(m) {
  return m < 10 ? '0' + m : m
}

function format(shijianchuo,type,hms) {
  // shijianchuo是整数，否则要parseInt转换 *1000
  // shijianchuo 时间戳    type 隔开的符号   m格式
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  if(type){
    if(hms){
      return y + type + add0(m) + type + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s) ;
    }
    return y + type + add0(m) + type + add0(d) ;
  }
  return y + '.' + add0(m) + '.' + add0(d) ;
}


const lcData = {
  format,
}

export default lcData