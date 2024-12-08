let handler = async (m, { conn }) => {
  if (new Date - global.db.data.users[m.sender].lastclaim > 86400000) {
    conn.reply(m.chat, 'Nih Gw Kasih Modal Buat beli limit\n50.000 Rupiah', m)  
    global.db.data.users[m.sender].money += 50000
    global.db.data.users[m.sender].lastclaim = new Date * 1
  } else conn.reply(m.chat, 'Bagi uang 100.000:v', m)
}
handler.help = ['bonus', 'hadiah']
handler.tags = ['rpg']
handler.command = /^(bonus|hadiah)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.rpg = true
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0

module.exports = handler