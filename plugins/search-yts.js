/* 
 * by Indra don't delete my wm!
*/
let handler = async(m, { conn, text }) => {
if(!text) throw "Contoh penggunaan: .yts can i be him"
let yts = require('yt-search')
let { generateWAMessageFromContent, prepareWAMessageMedia, proto } = require("@whiskeysockets/baileys") 
let anu = (await yts(text)).all
let video = anu.filter(v => v.type === 'video') 
let channel = anu.filter(v => v.type === 'channel') 
let indra = `*Powered By Veemon*\nmenampilkan hasil pencarian untuk : "${text}", pilih di bawah ini sesuai format yang Anda inginkan. 🍿`
let image = 'https://telegra.ph/file/30897fc6b429c59d2a733.jpg'

let sections = [{
		title: namebot, 
		highlight_label: 'start chats', 
		rows: [{
			header: namebot, 
	title: "Menu",
	description: `kembali ke menu !`, 
	id: '.menu'
	},
	{
		header: namebot, 
		title: "Owner Bot", 
		description: "Owner bot, pemilik Veemon", 
		id: '.owner'
	}]
}]

video.forEach(async(data) => {
sections.push({
	title: data.title, 
	rows: [{
		title: "Get Video", 
		description: `Get video from "${data.title}"`, 
		id: `.ytmp4 ${data.url}`
		}, 
		{
		title: "Get Audio", 
		description: `Get audio from "${data.title}"`, 
		id: `.ytmp3 ${data.url}`
		}]
	}) 
}) 
let listMessage = {
    title: 'Click here! ', 
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
            text: indra
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: footer
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            subtitle: namebot,
            hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: image }}, { upload: conn.waUploadToServer })) 
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "single_select",
                "buttonParamsJson": JSON.stringify(listMessage) 
              }, 
              {
                 "name": "cta_url",
                 "buttonParamsJson": `{"display_text":"Saluran 🌐","url":"https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C","merchant_url":"https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C"}`
              }
           ],
          })
        })
    }
  }
}, { quoted: m})

await conn.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id
})
}


handler.help = 'ytsearch'
handler.tags = 'search'
handler.command = /^(yts|ytsearch)/i;

module.exports = handler