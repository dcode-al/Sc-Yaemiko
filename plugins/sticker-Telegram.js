const { MessageType } = require('@whiskeysockets/baileys')
const fetch = require('node-fetch')
const { sticker } = require('../lib/sticker')
let handler = async (m, { conn, args, usedPrefix, command }) => {

    if (!args[0]) throw `• *Example :* ${usedPrefix + command} https://t.me/addstickers/namapack`
    conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
    if (!args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) throw `url wrong`
    let packName = args[0].replace("https://t.me/addstickers/", "")

    let gas = await fetch(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(packName)}`, { method: "GET", headers: { "User-Agent": "GoogleBot" } })
    if (!gas.ok) throw eror

    let json = await gas.json()
    m.reply(`*Total stiker:* ${json.result.stickers.length}
*Estimasi selesai:* ${json.result.stickers.length * 1.5} detik`.trim())

    for (let i = 0; i < json.result.stickers.length; i++) {
        let fileId = json.result.stickers[i].thumb.file_id

        let gasIn = await fetch(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${fileId}`)

        let jisin = await gasIn.json()


        // conn.sendMessage(m.chat, { url: "https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/" + jisin.result.file_path }, MessageType.sticker)
        let stiker = await sticker(false, "https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/" + jisin.result.file_path, '© Takemii.js', null)
        await conn.sendMessage(m.chat, {sticker: stiker })
        await delay(1500)
    }
    conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
}

handler.help = ['stikertelegram *<url>*']
handler.tags = ['sticker']
handler.command = /^(stic?kertele(gram)?)$/i

handler.limit = true
handler.premium = false

module.exports = handler

const delay = time => new Promise(res => setTimeout(res, time))