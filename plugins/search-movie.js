var fetch = require("node-fetch")
var { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@whiskeysockets/baileys")

var handler = async (m, { conn, text, usedPrefix, command }) => {
  if (command === 'movie') {
  if (!text) return conn.reply(m.chat, `• *Example :* ${usedPrefix + command} avatar`, m)
  conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
  let kemii = await movie(text)  
  let sections = [{
  rows: []
  }]
  for(let i of kemii.data) {
  sections[0].rows.push({
  header: i.title,
  title: `Rating: ${i.rating}`, 
  description: `${i.genre}`, 
  id: `.moviedetail ${i.url}`
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
  title: 'Pilih movie Di Bawah Ini!',
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
  } else if (command === 'moviedetail') {
  if (!text) return
  conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
  let indra = await moviedetail(text)
  let teks = '```Genre:```' + ` ${indra.data.genre}\n`
  teks += '```Actors:```' + ` ${indra.data.actors}\n`
  teks += '```Trailer:```' + ` ${indra.data.trailer}\n`
  teks += '```Duration:```' + ` ${indra.data.duration}\n`
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
  text: 'Powered By _ICSF Team_'
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
}

handler.help = ['movie *<text>*']
handler.tags = ['search']

handler.command = ["movie","moviedetail"]
handler.premium = false
handler.register = true
handler.limit = true

module.exports = handler

async function moviedetail(url) {
let api = await Func.fetchJson(`https://api.alyachan.dev/api/movies-get?url=${url}/&apikey=${alyapi}`)
return api
}
async function movie(text) {
let api = await Func.fetchJson(`https://api.alyachan.dev/api/movies?q=${text}&apikey=${alyapi}`)
return api
}