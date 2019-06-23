const { Wechaty, Friendship, Contact } = require('wechaty')
const { filterTime } = require('./untils')
const {
  getBilibili,
  getWether,
  getReplay,
  tcRobot,
  tcTrans
} = require('./crawler')
const config = require('./config')
const schedule = require('node-schedule')
const logger = require('./untils/logger')

const wechat = new Wechaty({ name: 'WatasiWechat' })

// 生成二维码
function onScan(qrcode, status) {
  require('qrcode-terminal').generate(qrcode) // 在 terminal 中显示二维码

  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
    '&size=150x150&margin=20'
  ].join('')

  console.log(qrcodeImageUrl)
}

// 登录
function onLogin(user) {
  logger.info(`${user}登录成功`)

  main()
}

// 退出
function onLogout(user) {
  logger.info(`${user}退出`)
}

// 自动加好友
async function onFriendShip(friendship) {
  try {
    if(friendship.type() === Friendship.Type.Receive) {  // receive new friendship request from new contact
      let addFriendReg = eval(config.ADDFRIENDWORD)

      // 打招呼中带有自动加好友关键字，并且开启了自动加好友功能
      if(addFriendReg.test(friendship.hello()) && config.AUTOADDFRIEND) {
        const contact = friendship.contact()
        let result = await friendship.accept()
        if(result) {
          logger.warn(`${contact.name()} === 已经是你的好友了`)
        } else {
          logger.info(`${contact.name()} === 添加成功，是否开启进去功能: ${config.AUTOADDROOM}`)

          if(config.AUTOADDROOM) {  // 进群
            let targetRoom = await this.Room.find({ topic: eval(config.ROOMNAME) })
            if(targetRoom) {
              try {
                let hasInRoom = await targetRoom.has(contact)
                if(hasInRoom) {
                  logger.warn(`${contact.name()} === 已是群员`)
                  return
                }
                await targetRoom.add(contact)
                logger.info(`${contact.name()} === 进群成功`)
              } catch (error) {
                lotter.error("自动加群出错 ==> ", error)
              }
            }
          }
        }
      } else {
        logger.warn('好友请求为验证，请求语是 ==> ', friendship.hello())
      }
    } else if(friendship.type() === Friendship.Type.Confirm) { // confirm friendship
      logger.warn(`new friendship confirmed with ${friendship.contact().name()}`)
    }
  } catch (error) {
    logger.error("加好友出错 ==> ", error)
  }
}

// 加群提醒
async function roomJoin(room, inviteeList, inviter) {
  const nameList = inviteeList.map(c => c.name()).join(',')
  let res = await room.topic()
  const roomNameReg = eval(config.ROOMNAME)
  if(roomNameReg.test(res)) {
    logger.info(`群名: ${res}, 新成员: ${nameList}, 邀请人: ${inviter}`)
    room.say(`欢迎新朋友 ${nameList} 様 👏👏👏`)
  }
}

// 监听对话
async function onMessage(msg) {
  const contact = msg.from() // 发消息人
  const content = msg.text() //消息内容
  const room = msg.room() //是否是群消息

  if(msg.self()) return

  if(room) {
    logger.info("群聊")
  } else if(contact.type() === Contact.Type.Personal) {
    if(config.AUTOADDROOM && eval(config.ADDROOMWORD).test(content)) {  // 进群
      logger.info('发起进群请求')
      let targetRoom = await this.Room.find({ topic: eval(config.ROOMNAME) })
      if(targetRoom) {
        try {
          let hasInRoom = await targetRoom.has(contact)
          if(hasInRoom) return
          await targetRoom.add(contact)
        } catch (error) {
          logger.error("申请加群出错 ==> ", error)
        }
      }
    } else if(config.AUTOREPLY) {  // 自动聊天
      if(eval(config.EXCLUDE).test(content)) {
        logger.info("过滤")
        return
      }
      // let reply = await getReplay(content) // 天性机器人
      let reply = await tcRobot(content) // 腾讯闲聊
      // let reply = await tcTrans(content)  // 腾讯翻译
      try {
        await contact.say(reply)
      } catch (error) {
        logger.error("自动聊天出错了 ==> ", error)
      }
    }
  }
}

// 执行爬虫，获取今日发送内容
function main() {
  schedule.scheduleJob(config.SENDDATE, async function() {
    let time = filterTime(Date.now(), 'yyyy年MM月dd日 hh:mm')
    logger.warn(`${new Date().getHours()}点了，小爬虫开始工作了`)
    let msg = time + '<br><br>'
    let contact = await wechat.Contact.find({ alias: config.NAME }) || await wechat.Contact.find({ name: config.NICKNAME }) // 获取你要发送的联系人
    msg += '【今日天气】：<br>'
    msg += await getWether()
    // msg += '<br><br>'
    // msg += await getBilibili()
  
    try {
      await contact.say(msg)
    } catch (error) {
      logger.error("爬虫出错了 ==> ", error.message)
    }
  })
}

wechat.on('scan', onScan)
wechat.on('login', onLogin)
wechat.on('logout', onLogout)
wechat.on('message', onMessage)
wechat.on('friendship', onFriendShip)
wechat.on('room-join', roomJoin)

wechat.start()
  .then(() => logger.info("请使用微信扫一扫登录"))
  .catch(e => logger.error("微信登录出错 ===> ", e))
