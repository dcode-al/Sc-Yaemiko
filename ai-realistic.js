let fetch = require('node-fetch')
let handler = async (m, { conn, args, text, command, usedPrefix, isCreator, isPrems }) => {
  if (!text) return conn.reply(m.chat, `• *Example :* ${usedPrefix}${command} 1girl, solo, ponytail, blush.`, m)
	conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		}
	})
  let api = await Func.fetchJson(`https://itzpire.site/ai/realistic?prompt=${text}`)
  conn.sendFile(m.chat, api.result, 'realistic.jpg', '', m, false)
}
handler.help = ['realistic *<text>*'];
handler.command = /^realistic$/i
handler.tags = ['ai'];
handler.register = true;
handler.premium = true;
handler.limit = true;

module.exports = handler;