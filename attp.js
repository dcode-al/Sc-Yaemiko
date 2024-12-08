const {
    sticker
} = require('../lib/sticker.js')
let handler = async (m, {
    conn,
    text
}) => {
    if (!text[0]) return m.reply(`Teksnya Mana Kak?\nContoh: .attp undergood`)
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
   
    let stiker = await sticker(null, `https://tenor.googleapis.com/v2/render_dynamic_text?client_key=waffles&key=AIzaSyCbDgY_wZO9guZMktW6MnOGo-nKVFXqaUE&%24alt=proto&text=${encodeURIComponent(text)}&id=258698638&config.output_media_format=2&config.width=320&config.height=200&config.frames_per_second=20&config.composition_type=3`, global.packname, global.author)
    if (stiker) return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
    throw stiker.toString()
}
handler.help = ['attp <teks>']
handler.tags = ['sticker']
handler.command = /^attp$/i
handler.limit = true
module.exports = handler