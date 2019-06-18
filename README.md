# 微信机器人
- [x] 定时想特定好友发送信息
  - 获取`墨迹天气`今日天气状况
  - 获取`哔哩哔哩`今日更新新番
- [x] 自动添加好友
- [x] 自动回复
  - 群聊不支持自动回复
  - 不支持语音
  - 不支持表情
  - 不支持多媒体
  - **仅支持文本**
  - 不保证并发
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
  SENDDATE: '0 0 14 * * *',  // 每天8点定时发送
  MOJIHOST: 'https://tianqi.moji.com/weather/china',  // 墨迹天气
  BILIBILI: 'https://www.bilibili.com/guochuang/timeline/', // 哔哩哔哩新番时间表

  AIBOTAPI: 'http://api.tianapi.com/txapi/robot/', // 机器人接口(废弃)
  APIKEY: '', // api key(废弃)
  
  AUTOREPLY: false, //自动聊天
  EXCLUDE: '/现在我?们?可以开始聊天了/i', // 自动聊天排除关键字正则

  AUTOADDFRIEND: true,  // 自动加好友
  ADDFRIENDWORD: '/罪世界/i',  // 自动加好友正则

  AUTOADDROOM: true,  // 自动拉群
  ADDROOMWORD: '/进群/i',  // 加群关键字正则
  ROOMNAME: '/罪世界/i', // 群名正则

  TCAPPID: '',  // 腾讯AI appid
  TCAPPKEY: '', // 腾讯AI app key
  TCURL: 'https://api.ai.qq.com/fcgi-bin/nlp/nlp_textchat'  // 腾讯AI闲聊机器人接口
}
```

## 部署
Centos7下安装`puppeteer`不成功，[参考这里](https://segmentfault.com/a/1190000011382062)
```bash
#依赖库
yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y

#字体
yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y
```

## 关于哔哩哔哩
刚开始使用`superagent`去爬`哔哩哔哩今日新番`，折腾了几分钟，都拿不到想要的数据。<br>
看了看B站，发现用`ajax`请求不到页面数据，转而使用了`puppeteer`。

## 问题处理
2017年6月下旬开始，使用web版微信存在大概率被现在登录的可能性，仅仅是`web版微信`，不影响其他平台(手机、PC客户端等)。<br>
验证是否被限制登录，[微信官网](https://wx.qq.com)扫码查看能否登录即可
