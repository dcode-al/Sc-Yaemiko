const xpperbalance = 1
let handler = async (m, { conn, command, args }) => {
  let count = command.replace(/^nabung/i, '')
  count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].balance / xpperbalance) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)
  if (global.db.data.users[m.sender].money >= xpperbalance * count) {
    global.db.data.users[m.sender].money -= xpperbalance * count
    global.db.data.users[m.sender].bank += count
    conn.reply(m.chat, `-Rp.${xpperbalance * count} 💹\n+ ${count} 💳\n\n[ ! ] Succes menabung !`, m)
  } else conn.reply(m.chat, `[❗] Uang anda tidak mencukupi untuk menabung ${count} !`, m)
}
handler.help = ['nabung <jumlah>']
handler.tags = ['rpg']
handler.command = /^nabung ([0-9]+)|nabung$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.rpg = true
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.register = true
handler.limit = true

handler.fail = null
handler.exp = 0

module.exports = handler
