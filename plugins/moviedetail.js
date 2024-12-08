var fetch = require("node-fetch")

var handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `â€¢ *Example :* ${usedPrefix + command} <link>`, m)
  conn.sendMessage(m.chat, { react: { text: "ðŸ•’", key: m.key } });
  let indra = await moviedetail(text)
  let teks = '```Genre:```' + ` ${indra.data.genre}\n`
  teks += '```Actors:```' + ` ${indra.data.actors}\n`
  teks += '```Country:```' + ` ${indra.data.country}\n`
  teks += '```Duration:```' + ` ${indra.data.duration}\n`
teks += '```Trailer:```' + ` ${indra.data.trailer}\n`
  teks += '```Ranting:```' + ` ${indra.data.ratings}`
  let { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@whiskeysockets/baileys") 
  let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
  message: {
  "messageContextInfo": {
  "deviceListMetadata": {},
  "deviceListMetadataVersion": 2
  },
  interactiveMessage: proto.Message.InteractiveMessage.create({
  body: proto.Message.InteractiveMessage.Body.create({
  text: teks
  }),
  footer: proto.Message.InteractiveMessage.Footer.create({
  text: 'Powered By _FurinaV3_'
  }),
  header: proto.Message.InteractiveMessage.Header.create({
  title: indra.data.title,
  hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: indra.data.thumbnail } }, { upload: conn.waUploadToServer }))
  }),
  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
  buttons: [
  {
  name: "cta_url",
  buttonParamsJson: `{"display_text":"Streaming Here!","url":"${indra.data.streaming[0].url}","merchant_url":"${indra.data.streaming[0].url}"}`
  },
  {
  name: "cta_url",
  buttonParamsJson: `{"display_text":"Download Here!","url":"${indra.data.download[0].url}","merchant_url":"${indra.data.download[0].url}"}`
  }
  ],
  })
  })
  }
  }
}, { userJid: m.chat, quoted: m })
conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })
}

handler.command = /^(moviedetail)$/i
handler.register = true
module.exports = handler

async function moviedetail(url) {
let api = await Func.fetchJson(`https://api.alyachan.dev/api/movies-get?url=${url}&apikey=${alyapi}`)
return api
}