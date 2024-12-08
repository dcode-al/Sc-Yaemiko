var handler = async (m, { conn, text, command }) => {
if (!text) return m.reply('Masukan query!')
switch (command) {
  case "megawati": case "echilling": case "nokotan": case "jokowi": case "adam": case "prabowo": {
    conn.sendMessage(m.chat, { audio: { url: `https://ai.xterm.codes/api/text2speech/elevenlabs?text=${text}&key=dcodeindraa&voice=${command}` }, mimetype: "audio/mpeg", ptt:true }, { quoted: m })
  }
  break
}
}
handler.command = handler.help = ["megawati", "prabowo", "jokowi", "echilling", "adam", "nokotan"]
handler.tags = ["tools"]
module.exports = handler