let { MessageType } = require('@whiskeysockets/baileys')
let handler = async (m, { conn, text, usedPrefix }) => {
  function no(number){
    return number.replace(/\s/g,'').replace(/([@+-])/g,'')
  }
  
  if (!text) return conn.reply(m.chat, `*Example :* ${usedPrefix}resetakun 6288221755573`, m)
  text = no(text) + "@s.whatsapp.net"
  global.db.data.users[text].lastyoutuber = false
  global.db.data.users[text].lastyoutuber = 0
global.db.data.users[text].subscribers = false
  global.db.data.users[text].subscribers = 0
global.db.data.users[text].viewers = false
  global.db.data.users[text].viewers = 0
global.db.data.users[text].like = false
  global.db.data.users[text].like = 0
global.db.data.users[text].playButton = false
  global.db.data.users[text].playButton = 0
  conn.reply(m.chat,`*Successfully reset akun yt @${text.split('@')[0]}.*`,m,{ contextInfo: { mentionedJid: [text] } })

}
handler.help = ['resetakunyt *<number>*']
handler.tags = ['owner', 'mods']
handler.command = /^(resetakunyt)$/i
handler.mods = true
handler.fail = null
module.exports = handler