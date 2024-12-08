let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `• *Example :* ${usedPrefix}${command} cat on the fire`, m)
  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
  let hasil = await Func.fetchJson(`https://api.neoxr.eu/api/ai-real?q=${text}&apikey=${global.neoapi}`)
  await conn.sendFile(m.chat, hasil.data.url, '', '', m)
}
 
handler.help = ['aireal *<text>*'];
handler.command = /^aireal$/i;
handler.tags = ['ai'];
handler.register = true;
handler.premium = false;
handler.limit = true;

module.exports = handler;