# 微信机器人
- [x] 定时想特定好友发送信息
  - 获取`墨迹天气`今日天气状况
  - 获取`哔哩哔哩`今日更新新番
- [x] 自动添加好友
- [x] 自动回复
  - 群聊不支持自动回复
- [x] 自动拉群
  - 回复`进群`关键字，即可拉进`罪世界`群

## 配置文件
请在项目根目录添加`config/index.js`文件
```javascript
// config/index.js
module.exports = {
  NICKNAME: 'わたし', // 昵称
  NAME: 'わたし', // 备注
  PROVINCE: 'jiangsu',  // 省
  CITY: 'suzhou', // 城市
  SENDDATE: '0 0 8 * * *',  // 每天8点定时发送
  MOJIHOST: 'https://tianqi.moji.com/weather/china',  // 墨迹天气
  BILIBILI: 'https://www.bilibili.com/guochuang/timeline/', // 哔哩哔哩新番时间表

  AIBOTAPI: 'http://api.tianapi.com/txapi/robot/', // 机器人接口
  APIKEY: '', // api key
  
  AUTOREPLY: false, //自动聊天
  EXCLUDE: '/现在我?们?可以开始聊天了/i', // 自动聊天排除关键字正则

  AUTOADDFRIEND: true,  // 自动加好友
  ADDFRIENDWORD: '/罪世界/i',  // 自动加好友正则

  AUTOADDROOM: true,  // 自动拉群
  ADDROOMWORD: '/进群/i',  // 加群关键字正则
  ROOMNAME: '/罪世界/i', // 群名正则
}
```

## 关于哔哩哔哩
刚开始使用`superagent`去爬`哔哩哔哩今日新番`，折腾了几分钟，都拿不到想要的数据。<br>
看了看B站，发现用`ajax`请求不到页面数据，转而使用了`puppeteer`。

## bug
- 多人同时和机器人聊天，会导致程序崩掉(所以自动聊天默认关闭)

## 最后
可以扫码添加好友进行测试，好友验证填写`罪世界`才可以自动添加好友<br>
加好友后，会自动加群，也可发送`进群`<br>
![qrcode](./public/images/qrcode.jpg)
