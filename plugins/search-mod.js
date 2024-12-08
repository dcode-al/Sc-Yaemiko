var fetch = require("node-fetch")
var { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@whiskeysockets/baileys")

var handler = async (m, { conn, text, usedPrefix, command }) => {
  if (command === 'mod') {
  if (!text) return conn.reply(m.chat, `• *Example :* ${usedPrefix + command} avatar`, m)
  conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
  let kemii = await mod(text)  
  let sections = [{
  rows: []
  }]
  for(let i of kemii.data) {
  sections[0].rows.push({
  header: i.title,
  description: `${i.synopsis}`, 
  id: `.moddetail ${i.url}`
  }) 
  }
  let listMessage = {
  title: 'Click here!', 
  sections
  };
  let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
  message: {
  "messageContextInfo": {
  "deviceListMetadata": {},
  "deviceListMetadataVersion": 2
  },
  interactiveMessage: proto.Message.InteractiveMessage.create({
  body: proto.Message.InteractiveMessage.Body.create({
  }),
  footer: proto.Message.InteractiveMessage.Footer.create({
  text: 'Powered By _ICSF Team_'
  }),
  header: proto.Message.InteractiveMessage.Header.create({
  title: 'Pilih mod Di Bawah Ini!',
  hasMediaAttachment: false
  }),
  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
  buttons: [
  {
  "name": "single_select",
  "buttonParamsJson": JSON.stringify(listMessage) 
  }
  ],
  })
  })
  }
  }
  }, { userJid: m.chat, quoted: m })
conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })
  } else if (command === 'moddetail') {
  if (!text) return
  conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
  let salsa = await moddetail(text)
  let teks = '```Genre:```' + ` ${salsa.data.genre}\n`
  teks += '```Director:```' + ` ${salsa.data.director}\n`
  teks += '```Actors:```' + ` ${salsa.data.actors}\n`
  teks += '```Country:```' + ` ${salsa.data.country}\n`
  teks += '```Duration:```' + ` ${salsa.data.duration}\n`
  teks += '```Ranting:```' + ` ${salsa.data.ratings}`
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
  text: 'Powered By _ICSF Team_'
  }),
  header: proto.Message.InteractiveMessage.Header.create({
  title: salsa.data.title,
  hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: salsa.data.thumbnail } }, { upload: conn.waUploadToServer }))
  }),
  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
  buttons: [
  {
  name: "cta_url",
  buttonParamsJson: `{"display_text":"Streaming Hare!","url":"${salsa.data.streaming[0].url}","merchant_url":"${salsa.data.streaming[0].url}"}`
  },
  {
  name: "cta_url",
  buttonParamsJson: `{"display_text":"Streaming Here!","url":"${salsa.data.download[0].url}","merchant_url":"${salsa.data.download[0].url}"}`
  }
  ],
  })
  })
  }
  }
  }, { userJid: m.chat, quoted: m })
  conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })
  }
}

handler.help = ['mod *<text>*']
handler.tags = ['search']

handler.command = ["mod","moddetail"]
handler.premium = false
handler.register = true
handler.limit = true

module.exports = handler

async function moddetail(url) {
let api = await Func.fetchJson(`https://api.alyachan.dev/api/modapk-get?url=${url}&apikey=${alyapi}`)
return api
}
async function mod(text) {
let api = await Func.fetchJson(`https://api.alyachan.dev/api/modapk?q=${text}&apikey=${alyapi}`)
return api
}