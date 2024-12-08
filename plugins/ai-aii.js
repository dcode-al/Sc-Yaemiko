let fetch = require('node-fetch')
let uploadImage = require('../lib/uploadImage.js')
let handler = async (m, { conn, args, usedPrefix, text }) => {
    let q = m.quoted ? m.quoted: m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return conn.reply(m.chat, 'Send Reply Image', m)
    let img = await q.download()
    let url = await uploadImage(img)
    if (!text) return conn.reply(m.chat,  `• *Example :* .aii cara mengerjakan soal ini`, m)
    let salsa = await conn.reply(m.chat, '```Furina Sedang mencari jawaban...🔍```', m)
    const requestBody = {
        prompt: text,
        init_image: url,
        time_zone: "Asia/Jakarta",
        tone: "Balanced",
        strip_markdown: false
    };
    conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
    const response = await fetch('https://api.itsrose.life/chatGPT/bing_chat', {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `${global.rose}`
    }
    });
    const hasil = await response.json();
    await conn.sendMessage(m.chat, { text: `${hasil.result.message.content}`, edit: salsa })
}
handler.help = ['aii *<text>*']
handler.tags = ['ai']
handler.command = /^(aii)$/i
handler.premium = false
module.exports = handler