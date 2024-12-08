let handler = async (m, { conn, args, text, usedPrefix, command }) => {
 const JAIL_TIME = 60 * 60 * 1000
 let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : args[0] ? ((args.join('').replace(/[@ .+-]/g, '')).replace(/^\+/, '').replace(/-/g, '') + '@s.whatsapp.net') : '';
 const user = global.db.data.users[who]
 const usar = global.db.data.users[m.sender]
 if (usar.job == 'polisi') {
    if (!text) throw '*Siapa yang mau di *Warn?**'
    if (!who) return m.reply('*Tag target atau ketik nomornya*')
    if (!user) return m.reply(`*Pengguna ${who} tidak ada dalam database*`)
    
    user.banned = true
    user.bannedExpired = Date.now() + JAIL_TIME
    
    setTimeout(() => {
    conn.reply(who, `*Kamu telah di banned oleh ${usar.name}* kamu tidak dapat menggunakan bot selamanya`, fverif)
    }, 5000)
    conn.reply(m.chat, `Berhasil Warn *@${(who || '').replace(/@s\.whatsapp\.net/g, '')}*\nTerimakasih telah nge baned user tersebut._`, m, { mentions: [who] })
    return
   }
   await conn.reply(m.chat, '*Fitur ini hanya dikhususkan untuk Owner & mod*', m)
}

handler.help = ['warn']
handler.tags = ['owner']
handler.command = /^warn$/i
handler.register = true
handler.mods = true

module.exports = handler