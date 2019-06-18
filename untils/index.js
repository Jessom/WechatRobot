const superagent = require('superagent')
const config = require('../config')
const md5 = require('md5')

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

function jsonSort(jsonObj) {
	let arr=[]
	for(var key in jsonObj){
		arr.push(key)
	}
	arr.sort()
	let str=''
	for(let i in arr){
		if(jsonObj[arr[i]]) {
			str += `${arr[i]}=${encodeURIComponent(jsonObj[arr[i]])}&`
		}
	}
	return str
}

/**
 * 随机字符串
 */
function getNoncestr() {
	return Math.random().toString(36).substr(2)
}

/**
 * 时间戳(秒级)
 */
function getTimestamp() {
	return parseInt(Date.now() / 1000)
}

function getSign(params, key) {
	let str = ""
	str = jsonSort(params)

	str += `app_key=${key}`
	return md5(str).toLocaleUpperCase()
}

function getReqSign(options) {
	let nonce_str = getNoncestr()
  let time_stamp = getTimestamp()
  let params = Object.assign({
		'app_id': config.TCAPPID,
		'time_stamp': time_stamp.toString(),
		'nonce_str': nonce_str.toString(),
		'sign': ''
	}, options)
	params['sign'] = getSign(params, config.TCAPPKEY)
	
	return params
}

module.exports = {
  request,
	filterTime,
	delay,
	getNoncestr,
	getTimestamp,
	getSign,
	getReqSign
}
