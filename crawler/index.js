const { request } = require('../untils')
const config = require('../config')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')

// 获取哔哩哔哩今日新番
async function getBilibili() {
  let browser = null
  let page = null
  try {
    browser = await puppeteer.launch()
    page = await browser.newPage()
    console.log("开始爬取【哔哩哔哩今日新番】")
    await page.goto(config.BILIBILI)
    await page.waitFor(1000)
  
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
    console.log("【哔哩哔哩今日新番】爬取完成")
    return `【B站今日新番】: <br>${result.join('<br>')}`
  } catch (error) {
    browser.close()
    getBilibili()
  }

}


// 获取今日天气
async function getWether() {
  console.log("开始爬取【今日天气】")
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


  console.log("【今日天气】爬取完成")
  return `${wea_tips}<br>今天: ${wea_weather}<br>温度: ${wea_temp}<br>${wea_wind}${wea_level}<br>空气: ${wea_pollution}`
}

// 图灵机器人
async function getReplay(word) {
  try {
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

module.exports = {
  getBilibili,
  getWether,
  getReplay
}
