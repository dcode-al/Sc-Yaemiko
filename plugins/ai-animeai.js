let fetch = require('node-fetch')
let uploadImage = require('../lib/uploadImage.js')
let {photoToAnimeAI} = require("haji-api/modules/ai")
let handler = async (m, { conn, args, usedPrefix, text, command}) => {
    let q = m.quoted ? m.quoted: m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return conn.reply(m.chat, 'Send/Reply Images with the caption *.animeai*', m)
    let img = await q.download()
    let url = await uploadImage(img)
    if (!text) return conn.reply(m.chat,  `• *Example :* .animeai change to white hair`, m)
    conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
    let kemii = photoToAnimeAI({
    imageUrl: url,
    prompt: text
    })
    try {
    for (let i of kemii) {
    await conn.sendFile(m.chat, i, 'error.jpg', '', m)
    }
    } catch (e) {
    await conn.reply(m.chat, '```Status Request :```'+' `Failed`', m)
    }
}
handler.help = ['animeai *<text>*']
handler.tags = ['ai']
handler.command = /^(animeai)$/i
handler.premium = false
module.exports = handler