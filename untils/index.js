const superagent = require('superagent')

/**
 * 请求
 * @param {*} url 
 * @param {*} method 
 * @param {*} params 
 * @param {*} data 
 */
function request(url, method, params, data) {
  return new Promise((resolve, reject) => {
    superagent(method, url)
      .query(params)
      .send(data)
      .set('Content-Type','application/x-www-form-urlencoded')
      .end(function(err, response) {
        if(err) {
          reject(err)
        }
        resolve(response)
      })
  })
}

/**
 * 时间过滤器
 * @param {*} time 
 * @param {*} format 
 */
function filterTime(time, format) {
	format = format || 'yyyy-MM-dd hh:mm:ss';
	let date = new Date(parseInt(time))

	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	let dt = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	}

	for(let key in dt) {
		if(new RegExp(`(${key})`).test(format)) {
			let str = dt[key] + ''
			format = format.replace(RegExp.$1,
				(RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length)
			)
		}
	}
	return format
}

/**
 * 延时
 * @param {*} ms 
 */
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}

module.exports = {
  request,
	filterTime,
	delay
}
