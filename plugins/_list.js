let { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@whiskeysockets/baileys") 
let fetch = require('node-fetch')
let handler = async (m, {
    conn,
    command,
    isOwner
}) => {
let sections = [{
rows: [{
title: 'Main Feature',
description: `Displays menu Main ( List Menu )`, 
id: '.menu main'
},
{
title: 'Info Feature',
description: `Displays menu Info ( List Menu )`, 
id: '.menu info'
},
{
title: 'Download Feature',
description: "Displays menu Download ( List Menu )", 
id: '.menu downloader'
},
{
title: 'Ai Feature',
description: "Displays menu Ai ( List Menu )", 
id: '.menu ai'
},
{
title: 'Diffusion Feature',
description: "Displays menu Diffusion ( List Menu )", 
id: '.menu diffusion'
},
{
title: 'Convert Feature',
description: "Displays menu Convert ( List Menu )", 
id: '.menu convert'
},
{
title: 'Premium Feature',
description: "Displays menu Premium ( List Menu )", 
id: '.menu premium'
},
{
title: 'Judi Feature',
description: "Displays menu Judi ( List Menu )", 
id: '.menu judi'
},
{
title: 'Bug Feature',
description: "Displays menu Bug ( List Menu )", 
id: '.menu bug'
},
{
title: 'Game Feature',
description: "Displays menu Game ( List Menu )", 
id: '.menu game'
},
{
title: 'Fun Feature',
description: "Displays menu Fun ( List Menu )", 
id: '.menu fun'
},
{
title: 'Music Feature',
description: "Displays menu Music ( List Menu )", 
id: '.menu music'
},
{
title: 'Groups Feature',
description: "Displays menu Groups ( List Menu )", 
id: '.menu group'
},
{
title: 'Atlantic Feature',
description: "Displays menu Atlantic ( List Menu )", 
id: '.menu atlantic'
},
{
title: 'Smm Feature',
description: "Displays menu Smm ( List Menu )", 
id: '.menu smm'
},
{
title: 'Store Feature',
description: "Displays menu Store ( List Menu )", 
id: '.menu store'
},
{
title: 'Panel Feature',
description: "Displays menu Panel ( List Menu )", 
id: '.menu panel'
},
{
title: 'Ssh Feature',
description: "Displays menu Ssh ( List Menu )", 
id: '.menu ssh'
},
{
title: 'Jadibot Feature',
description: "Displays menu Jadibot ( List Menu )", 
id: '.menu jadibot'
},
{
title: 'Internet Feature',
description: "Displays menu Internet ( List Menu )", 
id: '.menu internet'
},
{
title: 'Hengker Feature',
description: "Displays menu Hengker ( List Menu )", 
id: '.menu hengker'
},
{
title: 'Islami Feature',
description: "Displays menu Islami ( List Menu )", 
id: '.menu islami'
},
{
title: 'Ephoto Feature',
description: "Displays menu Ephoto ( List Menu )", 
id: '.menu ephoto'
},
{
title: 'Textprome Feature',
description: "Displays menu Textprome ( List Menu )", 
id: '.menu textprome'
},
{
title: 'Owner Feature',
description: "Displays menu Owner ( List Menu )", 
id: '.menu owner'
},
{
title: 'Rpg Feature',
description: "Displays menu Rpg ( List Menu )", 
id: '.menu rpg'
},
{
title: 'Simulator Feature',
description: "Displays menu Simulator ( List Menu )", 
id: '.menu simulator'
},
{
title: 'Sticker Feature',
description: "Displays menu Sticker ( List Menu )", 
id: '.menu sticker'
},
{
title: 'Anonymous Feature',
description: "Displays menu Anonymous ( List Menu )", 
id: '.menu anonymous'
},
{
title: 'Tools Feature',
description: "Displays menu Tools ( List Menu )", 
id: '.menu tools'
},
{
title: 'Anime Feature',
description: "Displays menu Anime ( List Menu )", 
id: '.menu anime'
},
{
title: 'Search Feature',
description: "Displays menu Search ( List Menu )", 
id: '.menu search'
}]
}]
let listMessage = {
    title: 'Click Here!', 
    sections
}
//throw listMessage.sections[0].rows

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
			newsletterName: 'Powered By : Indra | Furina', 
			serverMessageId: -1
		},
	businessMessageForwardInfo: { businessOwnerJid: conn.decodeJid(conn.user.id) },
	forwardingScore: 256,
            externalAdReply: {  
                title: 'Furina', 
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
            text: footer
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: `*Hello, @${m.sender.replace(/@.+/g, '')}!*`,
            subtitle: namebot,
            hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: 'https://telegra.ph/file/8b9eab35d942fe8d760dc.jpg' }}, { upload: conn.waUploadToServer })) 
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
handler.command = /^(list)$/i
handler.register = true
handler.private = false
module.exports = handler