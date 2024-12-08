let fetch = require('node-fetch')
let handler = async (m, {
    conn,
    command,
    isOwner
}) => {
let sections = [{
rows: [{
title: '💸Judi 50 Ribu',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi 50000'
},
{
title: '💸Judi 100 Ribu',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi 100000'
},
{
title: '💸Judi 200 Ribu',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi 200000'
},
{
title: '💸Judi 300 Ribu',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi 300000'
},
{
title: '💸Judi 400 Ribu',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi 400000'
},
{
title: '💸Judi 500 Ribu',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi 500000'
},
{
title: '💸Judi 700 Ribu',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi 700000'
},
{
title: '💸Judi 800 Ribu',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi 800000'
},
{
title: '💸Judi 900 Ribu',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi 900000'
},
{
title: '💸Judi 1 Juta',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi 1000000'
},
{
title: '💸Judi 3 Juta',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi 3000000'
},
{
title: '💸Judi 5 Juta',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi 5000000'
},
{
title: '💸Judi All',
description: `Judi online berbetuk button ( Judi Button)`, 
id: '.juudi all'
}]
}]

let listMessage = {
    title: 'Menu Judi', 
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
			newsletterName: 'Powered By : NDRA', 
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
            text: `*Hello, @${m.sender.replace(/@.+/g, '')}!*`
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
handler.help = ['judi']
handler.tags = ['game']
handler.command = /^(judi)/i;
handler.limit = false
handler.group = true

handler.fail = null

module.exports = handler