let axios = require('axios')
let uploadImage = require('../lib/uploadImage.js')

let handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return conn.reply(m.chat, 'Send/Reply Images with the caption *.trackphoto*', m)
    let media = await q.download()
    let url = await uploadImage(media)
    try {
    conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		}
	})
	let hasil = await Func.fetchJson(`https://api.neoxr.eu/api/photo-tracker?image=${url}&apikey=${global.neoapi}`)
    await m.reply(hasil.data)
    } catch (e) {
    conn.reply(m.chat, `Haii @${m.sender.replace(/@.+/g, '')}, saat ini fitur *${usedPrefix}${command}* sedang coldown silahkan coba dalam beberapa saat lagi.`, m)
    }
}
handler.help = ["trackphoto *<image>*"]
handler.tags = ["ai"]
handler.command = /^(trackphoto)$/i
handler.limit = true
handler.register = true
module.exports = handler;
