let fetch = require('node-fetch')
let handler = async (m, {
    conn,
    command,
    isOwner
}) => {
let sections = [{
rows: [{
title: 'Enable Chat Bot',
description: `Activate chat bot ( Ai )`, 
id: '.cai on'
},
{
title: 'Disable Chat Bot',
description: `Deactivate chat bot ( Ai )`, 
id: '.cai off'
},
{
title: 'Search Chat Bot',
description: `Searching character chat bot ( Ai )"`, 
id: '.cai search'
}]
}]

let listMessage = {
    title: 'Click Here!', 
    sections
}
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
			newsletterName: 'Powered By : dcodekemii', 
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
            text: `Select the list button below.`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: 'Powered By _ICSF Team_'
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: `*Hello, @${m.sender.replace(/@.+/g, '')}!*`,
            subtitle: "Kemii",
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
}
handler.premium = false
handler.command = /^(listcai)$/i
handler.register = true
handler.private = false
module.exports = handler