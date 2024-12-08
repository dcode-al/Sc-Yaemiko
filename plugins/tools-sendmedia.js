/*
   * by balzz
   * dont delate my wm
   * pelase follow instagram: @iqstore78
*/
const handler = async (m, { conn }) => {
 if (!m.quoted) return m.reply("reply the media you want to send")
    let media = await m.quoted.download()
    const jid = '120363290835103806@newsletter'
    
    if (m.quoted.mtype === 'audioMessage') {
        conn.sendMessage(jid, { audio: media, mimetype: 'audio/mp4', ptt: true })
        m.reply('```Successfully sent audio to channel```')
    } else if (m.quoted.mtype === 'imageMessage') {
        conn.sendMessage(jid, { image: media, caption: '```Image sent from bot```' })
        m.reply('```Successfully sent image to channel```')
    } else {
        m.reply('```Unsupported media type```')
    }
}
handler.command = /^sendmedia$/
handler.tags = ["tools"]
handler.help = ["sendmedia"]
handler.owner = true

module.exports = handler