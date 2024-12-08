/*
 * @Wm By Indra
 * https://whatsapp.com/channel/0029VaYVlVP9hXF9Ig83hJ3L
 * Don't Delete My Wm
 */

let axios = require('axios')
let handler = async (m, { conn, args }) => {
  try {
    let text = args.join(' ')
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text
    if (!text) {
      m.reply("Masukkan kata")
      return
    }
    let res
    try {
      let response = await axios.get('https://ai.xterm.codes/api/text2speech/bella', {
        params: {
          key: 'dcodeindraa',
          text: text
        },
        responseType: 'arraybuffer' // Mengatur tipe respons sebagai arraybuffer untuk menerima data audio
      })
      res = response.data
      conn.sendFile(m.chat, res, 'tts.opus', null, m, true)
    } catch (e) {
      m.reply(e + '')
    }
  } catch (error) {
    console.log(error)
    m.reply("Masukkan Text")
  }
}

handler.help = ['voicebella <teks>']
handler.tags = ['tools']
handler.command = /^voicebella$/i
handler.limit = true
handler.premium = false

module.exports = handler