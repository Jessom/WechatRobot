const { Wechaty, Friendship, Contact } = require('wechaty')
const { filterTime } = require('./untils')
const {
  getBilibili,
  getWether,
  getReplay
} = require('./crawler')
const config = require('./config')
const schedule = require('node-schedule')

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
  console.log(`${user}登录成功`)

  schedule.scheduleJob(config.SENDDATE, function() {
    
    main()
  })
}

// 退出
function onLogout(user) {
  console.log(`${user}退出`)
}

// 自动加好友
async function onFriendShip(friendship) {
  try {
    if(friendship.type() === Friendship.Type.Receive) {  // receive new friendship request from new contact
      let addFriendReg = eval(config.ADDFRIENDWORD)

      // 打招呼中带有自动加好友关键字，并且开启了自动加好友功能
      if(addFriendReg.test(friendship.hello()) && config.AUTOADDFRIEND) {
        console.log("自动添加好友")
        const contact = friendship.contact()
        let result = await friendship.accept()
        if(result) {
          console.log(`Request from ${contact.name()} is accept succesfully!`)
        } else {
          console.log(`Request from ${contact.name()} failed to accept!`)

          if(config.AUTOADDROOM) {  // 进群
            let targetRoom = await this.Room.find({ topic: eval(config.ROOMNAME) })
            if(targetRoom) {
              try {
                let hasInRoom = await targetRoom.has(contact)
                if(hasInRoom) return
                await targetRoom.add(contact)
              } catch (error) {
                console.log("加群出错==>", error)
              }
            }
          }
        }
      } else {
        console.log("加好验证未通过=>", friendship.hello())
      }
    } else if(friendship.type() === Friendship.Type.Confirm) { // confirm friendship
      console.log(`new friendship confirmed with ${friendship.contact().name()}`)
    }
  } catch (error) {
    console.log("加好友出错啦==> ", error)
  }
}

// 加群提醒
async function roomJoin(room, inviteeList, inviter) {
  const nameList = inviteeList.map(c => c.name()).join(',')
  let res = await room.topic()
  const roomNameReg = eval(config.ROOMNAME)
  if(roomNameReg.test(res)) {
    console.log(`群名: ${res}, 新成员: ${nameList}, 邀请人: ${inviter}`)
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
    console.log("群聊")
  } else if(contact.type() === Contact.Type.Personal) {
    if(config.AUTOADDROOM && eval(config.ADDROOMWORD).test(content)) {  // 进群
      let targetRoom = await this.Room.find({ topic: eval(config.ROOMNAME) })
      if(targetRoom) {
        try {
          let hasInRoom = await targetRoom.has(contact)
          if(hasInRoom) return
          await targetRoom.add(contact)
        } catch (error) {
          console.log("加群出错==>", error)
        }
      }
    } else if(config.AUTOREPLY) {  // 自动聊天
      if(eval(config.EXCLUDE).test(content)) {
        console.log("过滤");
        return
      }
      let reply = await getReplay(content)
      try {
        await contact.say(reply)
      } catch (error) {
        console.log("自动聊天出错了==> ", error)
      }
    }
  }
}

// 执行爬虫，获取今日发送内容
async function main() {
  let msg = filterTime(Date.now(), 'yyyy-MM-dd hh:mm') + '<br>'
  let contact = await wechat.Contact.find({ alias: config.NAME }) || await wechat.Contact.find({ name: config.NICKNAME }) // 获取你要发送的联系人
  msg += await getWether()
  msg += '<br>'
  msg += await getBilibili()

  try {
    await contact.say(msg)
  } catch (error) {
    console.log("爬虫出错了===> ", error.message)
  }
}

wechat.on('scan', onScan)
wechat.on('login', onLogin)
wechat.on('logout', onLogout)
wechat.on('message', onMessage)
wechat.on('friendship', onFriendShip)
wechat.on('room-join', roomJoin)

wechat.start()
  .then(() => console.log("请使用微信扫一扫登录"))
  .catch(e => console.log("出错啦---> ", e))
