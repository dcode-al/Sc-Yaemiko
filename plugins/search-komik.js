var fetch = require("node-fetch")
var fs = require('fs');
var { PDFDocument } = require('pdf-lib')
var { exec } = require('child_process')
var axios = require('axios') 
var cheerio = require('cheerio') 
var { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@whiskeysockets/baileys")
var { googleImage }  = require('@bochilteam/scraper')

var handler = async (m, { conn, text, usedPrefix, command }) => {
  if (command === 'komik') {
  if (!text) return conn.reply(m.chat, `• *Example :* ${usedPrefix + command} tensei`, m)
  conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
  let kemii = await komik(text)  
  let sections = [{
  rows: []
  }]
  for(let i of kemii.data) {
  sections[0].rows.push({
  header: i.title,
  title: `Rating: ${i.score}`, 
  description: `${i.chapter}`, 
  id: `.komikdetail ${i.url}`
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
  title: 'Pilih Result Komik Di Bawah Ini!',
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
  } else if (command === 'komikdetail') {
  conn.judul = conn.judul ? conn.judul : {}
  if (!text) return
  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
  let salsa = await komikdetail(text)
  let keem = await googleImage(`Komik ${salsa.data.title}`)
  let teks = '```Genre:```' + ` ${salsa.data.genre}\n`
  teks += '```Update:```' + ` ${salsa.data.updated}\n`
  teks += '```Author:```' + ` ${salsa.data.author}\n`
  teks += '```Status:```' + ` ${salsa.data.status}\n`
  teks += '```Chapter:```' + ` ${salsa.data.chapter}\n`
  teks += '```Ranting:```' + ` ${salsa.data.score}`
  let sections = [{
  rows: []
  }]
  for(let i of salsa.data.chapters) {
  sections[0].rows.push({
  header: `Chapter: ${i.title.split(" ").pop().trim()}`,
  title: `Realese: ${i.release}`,
  id: `.komikdownload ${i.url}`
  }) 
  }
  let listMessage = {
  title: 'Baca Komik!', 
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
  text: teks
  }),
  footer: proto.Message.InteractiveMessage.Footer.create({
  text: 'Powered By _ICSF Team_'
  }),
  header: proto.Message.InteractiveMessage.Header.create({
  title: salsa.data.title,
  hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: keem[0] } }, { upload: conn.waUploadToServer }))
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
  conn.judul[m.sender] = { judul: salsa.title }
  } else if (command === 'komikdownload') {
  conn.judul = conn.judul ? conn.judul : {}
  if (!text) return 
  let { judul } = conn.judul[m.sender]
  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
  let images = []
  let kemii = await komikdownload(text)
  for (let i of kemii.data) {
  let buffers = await getBuffer(i) 
  images.push(buffers)
  }
  let pdfBuffers = await createPDF(images) 
  let path = `./komik/${m.sender}-${Date.now()}.pdf`
  fs.writeFileSync(path, pdfBuffers) 
  conn.sendMessage(m.chat, { document: fs.readFileSync(path), mimetype: 'application/pdf', fileName: judul }, { quoted: m }) 
  }
}

handler.help = ['komik *<text>*']
handler.tags = ['search']

handler.command = ["komik","komikdetail","komikdownload"]
handler.premium = false
handler.register = true
handler.limit = true

module.exports = handler

async function komik(text) {
let api = await Func.fetchJson(`https://api.neoxr.eu/api/comic?q=${text}&apikey=${global.neoapi}`)
return api
}

async function komikdetail(url) {
let api = await Func.fetchJson(`https://api.neoxr.eu/api/comic-get?url=${url}&apikey=${global.neoapi}`)
return api
}

async function komikdownload(url) {
let api = await Func.fetchJson(`https://api.neoxr.eu/api/comic-render?url=${url}&apikey=${global.neoapi}`)
return api
}

async function webp2png(arrayOfBuffer, folder) {
const pngPaths = [];
const path = `./komik/${folder}/`;
const respath = `./komik/${'result-' + folder}/`;
fs.mkdirSync(path, { recursive: true });
fs.mkdirSync(respath, { recursive: true });

const promises = arrayOfBuffer.map(async (imageBuffer, index) => {
const name = `${path}${index + 1}.webp`;
const resname = `${respath}${index + 1}.png`;
fs.writeFileSync(name, imageBuffer);
await new Promise((resolve, reject) => {
exec(`ffmpeg -i ${name} ${resname}`, (err) => {
if (err) reject(err);
else resolve();
});
});
pngPaths.push(fs.readFileSync(resname));
fs.unlinkSync(name) 
fs.unlinkSync(resname) 
});
await Promise.all(promises);
return pngPaths;
}
	
async function createPDF(buffer) {
const pdfDoc = await PDFDocument.create();
const pngPaths = await webp2png(buffer, Date.now());

for (const imageBuffer of pngPaths) {
const pngImage = await pdfDoc.embedPng(imageBuffer);
const { width, height } = pngImage.scale(1);
const page = pdfDoc.addPage([width, height]);
page.drawImage(pngImage, {
x: 0,
y: 0,
width: width,
height: height
});
}
return pdfDoc.save();
}
	
async function getBuffer(url) {
let response = await axios({
method: 'get',
url: url,
responseType: 'arraybuffer'
});
return response.data
}