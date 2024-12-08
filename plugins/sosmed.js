let fetch = require('node-fetch')
let handler = async (m, {
    conn,
    command,
    isOwner
}) => {
let sections = [{
rows: [{
title: '👤Owner',
description: `Display owner bot ( Owner )`, 
id: '.pemilik'
}]
}]

let listMessage = {
    title: 'Menu Bot', 
    sections
};
//throw listMessage.sections[0].rows
const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys") 
let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
        contextInfo: {
        	mentionedJid: [m.sender], 
        	isForwarded: true, 
	        forwardedNewsletterMessageInfo: {
			newsletterJid: '120363144038483540@newsletter',
			newsletterName: 'Powered By FurinaV4', 
			serverMessageId: -1
		},
	businessMessageForwardInfo: { businessOwnerJid: conn.decodeJid(conn.user.id) },
	forwardingScore: 256,
            externalAdReply: {  
                title: 'DCODEKEMII', 
                thumbnailUrl: 'https://telegra.ph/file/a6f3ef42e42efcf542950.jpg', 
                sourceUrl: 'https://youtube.com/shorts/eHM3CMiAQ9Y?si=sqJQ1gyRAnptIK0m',
                mediaType: 2,
                renderLargerThumbnail: false
            }
          }, 
          body: proto.Message.InteractiveMessage.Body.create({
            text: `*Hello, @${m.sender.replace(/@.+/g, '')}! Ini adalah sosmed Indra tolong di follow ya*`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: footer
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            subtitle: namebot,
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "single_select",
                "buttonParamsJson": JSON.stringify(listMessage) 
              },
             {
              "name": "cta_url",
              "buttonParamsJson": "{\"display_text\":\"Grup Wa 📞\",\"url\":\"https://tinyurl.com/227ra4oe\",\"merchant_url\":\"https://tinyurl.com/227ra4oe\"}"
             },
             {
              "name": "cta_url",
              "buttonParamsJson": "{\"display_text\":\"Instagram\",\"url\":\"https://www.instagram.com/indraa_frna?igsh=MWdpbHE3YWY3cTBxeg==\",\"merchant_url\":\"https://www.instagram.com/indraa_frna?igsh=MWdpbHE3YWY3cTBxeg==\"}"
              },
              {
              "name": "cta_url",
              "buttonParamsJson": "{\"display_text\":\"YouTube \",\"url\":\"https://www.youtube.com/@indraafurina\",\"merchant_url\":\"https://www.youtube.com/@indraafurina\"}"
              },
              {
              "name": "cta_url",
              "buttonParamsJson": "{\"display_text\":\"Tiktok\",\"url\":\"https://www.tiktok.com/@iindra2024?_t=8nANOUc16eX&_r=1\",\"merchant_url\":\"https://www.tiktok.com/@iindra2024?_t=8nANOUc16eX&_r=1\"}"
},
{
              "name": "cta_url",
              "buttonParamsJson": "{\"display_text\":\"Saluran Chanel\",\"url\":\"https://whatsapp.com/channel/0029VaYVlVP9hXF9Ig83hJ3L\",\"merchant_url\":\"www.google.com\"}"
              }
           ],
          })
        })
    }
  }
}, {quoted: fverif})

await conn.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id
})
}
handler.customPrefix = /^(sosmed)$/i
handler.command = new RegExp

module.exports = handler