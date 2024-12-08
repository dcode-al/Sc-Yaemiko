const fs = require ('fs')
let handler = async (m, { conn, args, command }) => {
let fitur = Object.values(plugins).filter(v => v.help ).map(v => v.help).flat(1)
let totalf = Object.values(global.plugins).filter(
    (v) => v.help && v.tags
  ).length;
 await conn.reply(m.chat, `🚩 *Terdeteksi Jumlah Feature Saat Ini ${fitur.length} Feature*`, m)
}
handler.help = ['totalfitur', 'totalfeafure']
handler.tags = ['main']
handler.command = /^totalfitur|totalfeature|feature$/i
module.exports = handler