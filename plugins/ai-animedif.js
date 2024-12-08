const fetch = require('node-fetch')

let handler = async (m, { conn, text, usedPrefix, command, args }) => {  
  if (!text) throw `• *Example :* ${usedPrefix}${command} anime`
  conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
  const url = `https://api.itsrose.rest/image/anime/diffusion?prompt=${text}&width=512&height=512`
  fetch(url, {
  headers: {
  'accept': 'application/json',
  'Authorization': global.roseapi
  },
  })
  .then((response) => response.json())
  .then(data => {
  conn.sendFile(m.chat, Buffer.from(data.result.images[0], "base64"), '', '', m)
  })
}

handler.tags = ['ai']
handler.help = ['animediff *<text>*']
handler.command = /^(animediff|wibudiff|animedif|wibudif)$/i
handler.limit = true

module.exports = handler