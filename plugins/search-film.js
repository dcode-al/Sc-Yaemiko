var fetch = require("node-fetch");
var { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@whiskeysockets/baileys");

var handler = async (m, { conn, text, usedPrefix, command }) => {
  if (command === 'film') {
    if (!text) return conn.reply(m.chat, `• *Example :* ${usedPrefix + command} avatar`, m);
    conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    let kemii = await film(text);
    let sections = [{
      rows: []
    }];
    
    for (let i of kemii.data) {
      sections[0].rows.push({
        header: i.title,
        title: `Directors: ${i.directors}`,
        description: `Actors: ${i.actors}`,
        id: `.filmdetail ${i.url}`
      });
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
            body: proto.Message.InteractiveMessage.Body.create({}),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: 'Powered By _ICSF Team_'
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: 'Pilih Film Di Bawah Ini!',
              hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  "name": "single_select",
                  "buttonParamsJson": JSON.stringify(listMessage)
                }
              ]
            })
          })
        }
      }
    }, { userJid: m.chat, quoted: m });
    
    conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
    
  } else if (command === 'filmdetail') {
    if (!text) return;
    conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }});
    
    let salsa = await filmdetail(text);
    
    let teks = `*Title:* ${salsa.data.title}\n`;
    teks += `*Genre:* ${salsa.data.genre}\n`;
    teks += `*Director:* ${salsa.data.director}\n`;
    teks += `*Actors:* ${salsa.data.actors}\n`;
    teks += `*Country:* ${salsa.data.country}\n`;
    teks += `*Duration:* ${salsa.data.duration}\n`;
    teks += `*IMDB Rating:* ${salsa.data.imdb}\n`;
    teks += `*Release Date:* ${salsa.data.release}\n`;
    teks += `*Quality:* ${salsa.data.quality}\n`;
    teks += `*Uploaded:* ${salsa.data.uploaded}\n`;
    
    let streamOptions = '';
    if (salsa.stream && salsa.stream.length > 0) {
      for (let stream of salsa.stream) {
        streamOptions += `- ${stream.server} (${stream.quality}): [Watch here](${stream.url})\n`;
      }
    } else {
      streamOptions = 'No streaming options available.';
    }

    teks += `\n*Streaming Options:*\n${streamOptions}`;
    
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
              hasMediaAttachment: true,
              ...(await prepareWAMessageMedia({ image: { url: salsa.data.thumbnail } }, { upload: conn.waUploadToServer }))
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: []
            })
          })
        }
      }
    }, { userJid: m.chat, quoted: m });
    
    conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
  }
}

handler.help = ['film *<text>*']
handler.tags = ['search']

handler.command = ["film", "filmdetail"];
handler.premium = false;
handler.register = true;
handler.limit = true;

module.exports = handler;

async function filmdetail(url) {
  try {
    let encodedUrl = encodeURIComponent(url);
    let apiUrl = `https://api.neoxr.eu/api/film-get?url=${encodedUrl}&apikey=${global.neoapi}`;
    let response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    let api = await response.json();
    
    if (!api || !api.data) {
      throw new Error(`Invalid API response: ${JSON.stringify(api)}`);
    }

    return api;
  } catch (error) {
    console.error(`Error fetching film details: ${error.message}`);
    return null;
  }
}

async function film(text) {
  try {
    let apiUrl = `https://api.neoxr.eu/api/film?q=${text}&apikey=${global.neoapi}`;
    let response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    let api = await response.json();
    
    if (!api || !api.data) {
      throw new Error(`Invalid API response: ${JSON.stringify(api)}`);
    }

    return api;
  } catch (error) {
    console.error(`Error fetching film list: ${error.message}`);
    return null;
  }
}