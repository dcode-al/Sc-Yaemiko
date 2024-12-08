let { MessageType } = require('@whiskeysockets/baileys')
let handler = async (m, { conn, text, usedPrefix }) => {
  function no(number){
    return number.replace(/\s/g,'').replace(/([@+-])/g,'')
  }
  
  if (!text) return conn.reply(m.chat, `*Example :* ${usedPrefix}resetakun 6288221755573`, m)
  text = no(text) + "@s.whatsapp.net"
  global.db.data.users[text].exp = 0
  conn.reply(m.chat,`*Successfully reset akun yt @${text.split('@')[0]}.*`,m,{ contextInfo: { mentionedJid: [text] } })

}
handler.help = ['resetexp *<number>*']
handler.tags = ['owner', 'mods']
handler.command = /^(resetexp)$/i
handler.mods = true
handler.fail = null
module.exports = handler