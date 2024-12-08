let handler = async (m, { conn, text }) => {
	if(isNaN(text)) {
  	var number = text.split`@`[1]
  } else if(!isNaN(text)) {
  	var number = text
  }

  const format = num => {
    const n = String(num),
          p = n.indexOf('.')
    return n.replace(
        /\d(?=(?:\d{3})+(?:\.|$))/g,
        (m, i) => p < 0 || i < p ? `${m},` : m
    )
  }

  if(!text && !m.quoted) return conn.reply(m.chat, `*Berikan nomor, tag atau reply chat target.*`, m)
  // let exists = await conn.isOnWhatsApp(number)
  // if (exists) return conn.reply(m.chat, `*Nomor target tidak terdaftar di WhatsApp*`, m)
  if(isNaN(number)) return conn.reply(m.chat, `*Nomor tidak valid.*`, m)
  if(number.length > 15) return conn.reply(m.chat, `*Format is Invalid.*`, m)
  try {
		if(text) {
			var user = number + '@s.whatsapp.net'
		} else if(m.quoted.sender) {
			var user = m.quoted.sender
		} else if(m.mentionedJid) {
  		  var user = number + '@s.whatsapp.net'
			}  
		} catch (e) {
  } finally {
    let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {}
    let participants = m.isGroup ? groupMetadata.participants : []
    let users = m.isGroup ? participants.find(u => u.jid == user) : {}
    if(!user) return conn.reply(m.chat, `*Target atau Nomor tidak ditemukan, mungkin sudah keluar atau bukan anggota grup ini.*`, m)
    if(user === m.sender) return conn.reply(m.chat, `*Tidak bisa bersahabat dengan diri sendiri.*`, m)
    if(user === conn.user.jid) return conn.reply(m.chat, `*Tidak bisa bersahabat dengan bot.*`, m)
    
    if(global.db.data.users[user].bersahabat != m.sender){
      conn.reply(m.chat,`*Maaf @${user.split('@')[0]} tidak sedang mengajak bersahabat dengan anda*`,m,{contextInfo: {
        mentionedJid: [user]
      }})
    }else{
      global.db.data.users[m.sender].bersahabat = user
      conn.reply(m.chat,`*Selamat anda resmi bersahabat dengan @${user.split('@')[0]}*\n\n*Semoga jadi sahabat yang baik dan semoga tidak mengecewakan @${user.split('@')[0]} & @${m.sender.split('@')[0]} 🥳🥳*`,m,{contextInfo: {
        mentionedJid: [m.sender,user]
      }})
    }
	}	
}
handler.help = ['mau *@tag*']
handler.tags = ['bersahabat']
handler.command = /^(mau)$/i
handler.group = true
handler.limit = true
handler.fail = null
module.exports = handler