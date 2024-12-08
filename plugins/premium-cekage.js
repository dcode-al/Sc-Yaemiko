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
    if (!mime) return conn.reply(m.chat, 'Send/Reply Images with the caption *.cekage*', m)
    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
    let media = await q.download()
    let url = await uploadImage(media)
    try {
    let kemii = await Func.fetchJson(`https://api.neoxr.eu/api/age?image=${url}&apikey=${global.neoapi}`)
    await conn.sendFile(m.chat, url, '', `Age - ${kemii.data.age}\nGender - ${kemii.data.gender}`, m)
    } catch (e) {
conn.reply(m.chat, `Haii @${m.sender.replace(/@.+/g, '')}, saat ini fitur *${usedPrefix}${command}* sedang coldown silahkan coba dalam beberapa saat lagi.`, m)
}
}
handler.help = ["cekage *<image>*"]
handler.tags = ["premium","convert"]
handler.command = /^(cekage)$/i
handler.limit = true
handler.premium = true
handler.register = true

module.exports = handler;
