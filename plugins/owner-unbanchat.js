let handler = async (m, { conn }) => {
  global.db.data.chats[m.chat].isBanned = false
  m.reply('Terimakasih sudah membangun kan saya!')
}
handler.help = ['tangi *(untuk unbanchat)*']
handler.tags = ['owner', 'mods']
handler.customPrefix = /^(tangi)$/i
handler.command = new RegExp
handler.owner,handler.mods = true

module.exports = handler