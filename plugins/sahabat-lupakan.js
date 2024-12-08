let handler = async (m, { conn }) => {
  ayg = global.db.data.users[m.sender]

  if(ayg.bersahabat == ""){
    return conn.reply(m.chat,`Anda tidak memiliki sahabat.`,m)
  }
  
  beb = global.db.data.users[global.db.data.users[m.sender].bersahabat]

  if (typeof beb == "undefined"){
    conn.reply(m.chat,`Berhasil melupakan sahabat dengan @${global.db.data.users[m.sender].bersahabat.split('@')[0]}`,m,{contextInfo: {
      mentionedJid: [global.db.data.users[m.sender].bersahabat]
    }})
    ayg.bersahabat = ""
  }

  if (m.sender == beb.bersahabat){
    conn.reply(m.chat,`Berhasil melupakan sahabat dengan @${global.db.data.users[m.sender].bersahabat.split('@')[0]}`,m,{contextInfo: {
      mentionedJid: [global.db.data.users[m.sender].bersahabat]
    }})
    ayg.bersahabat = ""
    beb.bersahabat = ""
  }else {
    conn.reply(m.chat,`Anda tidak memiliki sahabat.`,m)
  }
}
handler.help = ['lupakansahabat']
handler.tags = ['bersahabat']
handler.command = /^(lupakansahabat)$/i
handler.group = true
handler.limit = true
handler.fail = null
module.exports = handler