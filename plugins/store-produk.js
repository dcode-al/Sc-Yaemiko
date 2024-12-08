let handler = async (m, { conn }) => {
conn.sendMessage(m.chat, { react: { text: '⏱️', key: m.key }})
  const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = require("@whiskeysockets/baileys") 
	
	const msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
      messageContextInfo: {
        deviceListMetadata: {},
        deviceListMetadataVersion: 2
      },
      interactiveMessage: proto.Message.InteractiveMessage.fromObject({
      contextInfo: {
        	mentionedJid: [m.sender], 
        	isForwarded: true, 
	        forwardedNewsletterMessageInfo: {
			newsletterJid: newsletterId,
			newsletterName: salurannama,
			serverMessageId: -1
		},
	businessMessageForwardInfo: { businessOwnerJid: conn.decodeJid(conn.user.id) },
	forwardingScore: 256,
            externalAdReply: {  
                title: 'AlDev', 
                thumbnailUrl: 'https://telegra.ph/file/a6f3ef42e42efcf542950.jpg', 
                sourceUrl: 'https://youtube.com/shorts/eHM3CMiAQ9Y?si=sqJQ1gyRAnptIK0m',
                mediaType: 2,
                renderLargerThumbnail: false
            }
          }, 
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `*Hello, @${m.sender.replace(/@.+/g, '')}!*\nSilahkan Lihat Produk Di Bawah Ada 3 Slide!`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: ' © Copyright By Yaemiko_'
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          hasMediaAttachment: false
        }),
        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
          cards: [
            {
              body: proto.Message.InteractiveMessage.Body.fromObject({
                text: `
> . . ╭─「 *Sewa Bot* 」──
> . . │ *7 Days : 3.000*
> . . │ *15 Days : 7,000*
> . . │ *30 Days : 15,000*
> . . │ *60 Days : 21,000*
> . . │ *Permanen : 30,000*
> . . ╰─────────────๑ 

 *Sewa bot bisa bisa memasukkan bot ke grup dan mendapatkan premium jadi bisa akses fitur premium di bot*
> Get Unlimited Limit
> Get Acces All Fitur
> Get Profile Good`
              }),
              footer: proto.Message.InteractiveMessage.Footer.fromObject({
              }),
              header: proto.Message.InteractiveMessage.Header.fromObject({
                title: ' *乂 SEWA BOT*\n',
                hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: 'https://pomf2.lain.la/f/750ihkfr.jpg' } }, { upload: conn.waUploadToServer }))
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson: `{"display_text":"Order Here!","url":"https://wa.me/6289531639634?text=Bang+saya+mau+*Sewa+Bot*","merchant_url":"https://wa.me/6289531639634?text=Bang+saya+mau+*Sewa+Bot*"}`
                  }
                  ]
              })
            },
          {
              body: proto.Message.InteractiveMessage.Body.fromObject({
                text: `
> . . ╭──「 *Premium* 」──
> . . │ *7 Days : 3.000*
> . . │ *15 Days : 7,000*
> . . │ *30 Days : 15,000*
> . . │ *60 Days : 21,000*
> . . │ *Permanen : 30,000*
> . . ╰──────────────๑

 *Premium itu hanya akses fitur premium saja kak seperti hdr, remini jadi anime,Nsfw,dll*
> Mendapatkan Limit Unlimited
> Dapat Profil Baik
> Bisa hdvideo`
              }),
              footer: proto.Message.InteractiveMessage.Footer.fromObject({
              }),
              header: proto.Message.InteractiveMessage.Header.fromObject({
                title: ' *乂 PREMIUM BOT*\n',
                hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: 'https://pomf2.lain.la/f/045qy0i.jpg' } }, { upload: conn.waUploadToServer }))
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson: `{"display_text":"Order Here!","url":"https://wa.me/6289531639634?text=Bang+saya+mau+*Beli+Premium*","merchant_url":"https://wa.me/6289531639634?text=Bang+saya+mau+*Beli+Premium*"}`
                  }
                  ]
              })
            },
            {
              body: proto.Message.InteractiveMessage.Body.fromObject({
                text: `> . . ╭─「 *Moderator* 」──
> . . │ *7 Days : 10,500*
> . . │ *30 Days : 20,000*
> . . │ *Permanen : 35,000*
> . . ╰──────────────๑

 *Moderator itu Kamu Bisa Akses Semua Feature Yang Tidak Bisa Di Akses Oleh Penggguna Premium*
> Bisa Menggunakan feature yang leluasa
> Semua fitur bisa di akses
> Bisa hampir seperti owner/Close`
              }),
              footer: proto.Message.InteractiveMessage.Footer.fromObject({
              }),
              header: proto.Message.InteractiveMessage.Header.fromObject({
                title: ' *乂 MODERATOR*\n',
                hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: 'https://pomf2.lain.la/f/m13r08ou.jpg' } }, { upload: conn.waUploadToServer }))
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson: `{"display_text":"Order Here!","url":"https://wa.me/6289531639634?text=Bang+saya+mau+*Jadi+Bot*","merchant_url":"https://wa.me/6289531639634?text=Bang+saya+mau+*Jadi+Moderator*"}`
                  }
                  ]
              })
            }
          ]
        })
      })
    }
  }
}, { userJid: m.chat, quoted: m })
conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })
}
handler.help = ['produk', 'sewabot','premium','moderator']
handler.tags = ['store']
handler.command = /^(produk|sewa|sewabot|premium|moderator|sew|prem)$/i

module.exports = handler