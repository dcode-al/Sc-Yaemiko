let fetch = require('node-fetch')
let handler = async (m, {
    conn,
    text,
    command,
    usedPrefix,
    isOwner
}) => {
if (!text) return conn.reply(m.chat, '• *Example :* .addpanel Indra 6285325268412', m)
let sections = [{
rows: [{
title: 'Panel 1gb',
description: `1gb ( Panel )`, 
id: `${usedPrefix}1gb ${text}`
},
{
title: 'Panel 2gb',
description: `2 gb ( Panel )`, 
id: `${usedPrefix}2gb ${text}`
},
{
title: 'Panel 3gb',
description: `3 gb ( Panel )`, 
id: `${usedPrefix}3gb ${text}`
},
{
title: 'Panel 4gb',
description: `4 gb ( Panel )`, 
id: `${usedPrefix}4gb ${text}`
},
{
title: 'Panel 5gb',
description: `5 gb ( Panel )`, 
id: `${usedPrefix}5gb ${text}`
},
{
title: 'Panel 6gb',
description: `6 gb ( Panel )`, 
id: `${usedPrefix}6gb ${text}`
},
{
title: 'Panel 7gb',
description: `7 gb ( Panel )`, 
id: `${usedPrefix}7gb ${text}`
},
{
title: 'Panel 8gb',
description: `8 Gb ( Panel )`, 
id: `${usedPrefix}8gb ${text}`
},
{
title: 'Panel 9gb',
description: `9 Gb ( Panel )`, 
id: `${usedPrefix}9gb ${text}`
},
{
title: 'unli',
description: `Unli panel ( Panel )`,
id: `${usedPrefix}unli ${text}`
}]
}]

let listMessage = {
    title: 'List panel!', 
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
			newsletterName: 'Powered By : FurinaV4', 
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
            text: `Pilih Waktu Di Bawah.`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: 'Powered By _ICSF Team_'
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: `*Hello, @${m.sender.replace(/@.+/g, '')}!*`,
            subtitle: namebot,
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
}, {})

await conn.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id
})
}
handler.tags = ['owner']
handler.help = ['panel']
handler.command = /^(addpanel)$/i
handler.owner = true

module.exports = handler