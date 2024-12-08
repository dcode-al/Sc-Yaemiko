const fetch = require("node-fetch");
const cheerio = require('cheerio')

let handler = async (m, { conn, text, usedPrefix, command }) => {
	if (!text) return conn.reply(m.chat, '• *Example :* .pindl https://i.pinimg.com/xxxx', m)
	conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
	let hasil = await Func.fetchJson(`https://api.lolhuman.xyz/api/pinterestdl?apikey=${global.lolkey}&url=${text}`)
	conn.sendFile(m.chat, hasil.result, 'pinterest.mp4', '', m)
}
handler.help = ['pindl'].map(v => v + ' *<url>*')
handler.tags = ['downloader']
handler.command = /^(pindl)$/i

module.exports = handler