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
      // Kirim permintaan HTTP ke API untuk konversi teks ke audio
      let response = await axios.get('https://ai.xterm.codes/api/text2speech/celia', {
        params: {
          key: 'aa',
          text: text
        },
        responseType: 'arraybuffer' // Mengatur tipe respons sebagai arraybuffer untuk menerima data audio
      })

      // Kirim file audio yang diterima ke chat
      res = response.data
      conn.sendFile(m.chat, res, 'tts.opus', null, m, true)
    } catch (e) {
      m.reply(e + '')
    }
  } catch (error) {
    console.log(error)
    m.reply("🐱 Input Text")
  }
}

handler.help = ['voicecellia <teks>']
handler.tags = ['tools']
handler.command = /^voicecellia$/i
handler.limit = true
handler.premium = false

module.exports = handler