let handler = async (m, { conn, participants }) => {
  // if (participants.map(v=>v.jid).includes(global.conn.user.jid)) {
    global.db.data.chats[m.chat].isBanned = true
    conn.reply(m.chat, 'Baiklah sayang, perhatian banget🥰', m)
  // } else m.reply('There is a host number here...')
}
handler.customPrefix = /^(furina turu|Turu|.furina turu|.turu|tidur|.tidur|.furina tidur|furina tidur)$/i
handler.command = new RegExp
handler.mods = true
handler.tags = ['mods', 'owner']
handler.help = ['turu *(untuk banchat*)']

module.exports = handler