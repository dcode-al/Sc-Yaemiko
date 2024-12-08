let {
    sticker
} = require( '../lib/sticker.js')

let handler = async (m, {
    conn
}) => {
    let json = await Func.fetchJson(global.API('https://api.waifu.pics', '/sfw/cry'))
    let stiker = await sticker(null, json.url, global.packname, global.author)
    if (stiker) return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, {
        asSticker: true,
        isAvatar: true
    })
    throw stiker.toString()
}
handler.help = ['stickercry']
handler.tags = ['sticker']
handler.command = /^cry|stickercry|stikercry$/i
handler.limit = true

module.exports = handler