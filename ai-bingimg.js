const { generateWAMessageContent, generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
let fetch = require ('node-fetch')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`• *Example:* ${usedPrefix + command} kucing`);

  await m.reply('Tunggu Sebentar kak Sedang di Proses....');

  async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent({
      image: { url }
    }, {
      upload: conn.waUploadToServer
    });
    return imageMessage;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  let push = [];
  
  const apiUrl = `https://api.betabotz.eu.org/api/search/bing-img?text=${encodeURIComponent(text)}&apikey=${global.btc}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (response.ok) {
      let res = data.result;

      shuffleArray(res);
      let ult = res.splice(0, 10);
      let i = 1;

      for (let lucuy of ult) {
        push.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: `Hasil Bing Image ke - ${i++}`
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: '乂 B I N G I M G' // Sesuaikan dengan watermark Anda
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: `Ini Kak Hasil Dari: ${text}`,
            hasMediaAttachment: true,
            imageMessage: await createImage(lucuy)
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              {
                "name": "cta_url",
                "buttonParamsJson": `{"display_text":"Source","url":"https://www.bing.com/images/search?q=${encodeURIComponent(text)}","merchant_url":"https://www.bing.com/images/search?q=${encodeURIComponent(text)}"}`
              }
            ]
          })
        });
      }

      const bot = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `*Hello, @${m.sender.replace(/@.+/g, '')}!* 
*Ini Kak Hasilnya* `
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: footer
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: false
              }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                cards: [...push]
              })
            })
          }
        }
      }, {});

      await conn.relayMessage(m.chat, bot.message, { messageId: bot.key.id });

    } else {
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

handler.help = ["bingimg *<text>*"]
handler.tags = ["ai"]
handler.command = /^(bingimg)$/i

module.exports = handler;