const {
  request,
  delay,
  getReqSign
} = require('../untils')
const config = require('../config')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const logger = require('../untils/logger')

// 获取哔哩哔哩今日新番
async function getBilibili() {
  try {
    let browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    let page = await browser.newPage()
    logger.warn("开始爬取【哔哩哔哩今日新番】")
    await page.goto(config.BILIBILI)
    // await page.waitFor(1000)
    await delay(2000)
  
    let result = await page.evaluate(function() {
      let arr = []
      let today = [...document.querySelectorAll('.today')]
      today.forEach(function(item) {
        if(item.querySelector('.season-item')) {
          [...item.querySelectorAll('.season-item')].forEach(function(c) {
            arr.push(c.children[0].getAttribute('title'))
          })
        }
      })
  
      return arr
    })
  
    browser.close()
    logger.warn("【哔哩哔哩今日新番】爬取完成")
    return `【B站今日新番】: <br>${result.join('<br>')}`
  } catch (error) {
    logger.error("【哔哩哔哩今日新番】爬取失败，返回自定义提示内容", error)
    return 'bilibili爬取失败'
  }
}

// 获取今日天气
async function getWether() {
  try {
    logger.warn("开始爬取【今日天气】")
    let url = `${config.MOJIHOST}/${config.PROVINCE}/${config.CITY}`
    let res = await request(url, 'GET')
    let $ = cheerio.load(res.text)
  
    let today = $('.forecast .days').first().find('li')
    let wea_tips = $('.wea_tips').children('em').text().replace(/(^\s*)|(\s*$)/g, "")
    let wea_weather = $(today[1]).text().replace(/(^\s*)|(\s*$)/g, "")
    let wea_temp = $(today[2]).text().replace(/(^\s*)|(\s*$)/g, "")
    let wea_wind = $(today[3]).find('em').text().replace(/(^\s*)|(\s*$)/g, "")
    let wea_level = $(today[3]).find('b').text().replace(/(^\s*)|(\s*$)/g, "")
    let wea_pollution = $(today[4]).find('strong').text().replace(/(^\s*)|(\s*$)/g, "")
  
  
    logger.warn("【今日天气】爬取完成")
    return `${wea_tips}<br>今天: ${wea_weather}<br>温度: ${wea_temp}<br>${wea_wind}${wea_level}<br>空气: ${wea_pollution}`
  } catch (error) {
    logger.error("【今日天气】爬取失败，返回自定义内容")
    return '【今日天气】爬取失败'
  }
}

// 图灵机器人
async function getReplay(word) {
  try {
    // await delay(2000) // 延迟两秒，防止多次请求
    let res = await request(config.AIBOTAPI, 'GET', { key: config.APIKEY, question: word })
    let content = JSON.parse(res.text)
    if (content.code === 200) {
      return content.newslist[0].reply
    } else {
      return '我好像迷失在无边的网络中了，你能找回我么'
    }
  } catch (error) {
    return '我好像迷失在无边的网络中了，你能找回我么'
  }
}

// 腾讯闲聊机器人
async function tcRobot(word) {
  let params = getReqSign({
    session: '10000',
    'question': word
  })
  try {
    let res = await request(config.TCURL, 'GET', params)
    let content = JSON.parse(res.text)
    if (content.ret === 0) {
      return content.data.answer
    } else {
      logger.warn(content)
      return '我好像迷失在无边的网络中了，你能找回我么'
    }
  } catch (error) {
    logger.error("闲聊机器人请求失败 ===> ", error)
    return '我好像迷失在无边的网络中了，你能找回我么'
  }
}

// 翻译
async function tcTrans(word) {
  let params = getReqSign({
    type: "0",
    text: word
  })
  console.log(params)
  // params['type'] = Number(params['type'])
  try {
    let res = await request('https://api.ai.qq.com/fcgi-bin/nlp/nlp_texttrans', 'GET', params)
    let content = JSON.parse(res.text)
    console.log(content)
    if(content.ret == 0) {
      return content.data.trans_text
    } else {
      return '翻译错误'
    }
  } catch (error) {
    return '翻译错误'
  }
}

module.exports = {
  getBilibili,
  getWether,
  getReplay,
  tcRobot,
  tcTrans
}
