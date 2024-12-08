const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@whiskeysockets/baileys");

let handler = async (m, { conn, usedPrefix, text, command }) => {
    if (!text) return conn.reply(m.chat, `• *Example :* ${usedPrefix + command} 628816609112`, m);

    await m.react('🕒'); // Emoji indicating processing

    try {
        let apiUrl = `http://apilayer.net/api/validate?access_key=your_numverify_api_key&number=${text}&country_code=&format=1`;
        let data = await Func.fetchJson(apiUrl);

        if (!data.valid) {
            await conn.reply(m.chat, 'Invalid phone number. Please enter a valid number.', m);
            await m.react('❌'); // Emoji indicating failure
            return;
        }

        if (command === 'getcontact') {
            let capt = `Phone Number: ${data.international_format}\n`;
            let txt = `> Carrier: ${data.carrier}\n`;
            txt += `> Country: ${data.country_name}\n`;
            txt += `> Location: ${data.location || 'Unknown'}\n`;
            txt += `> Line Type: ${data.line_type || 'Unknown'}\n`;

            let msg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        "messageContextInfo": {
                            "deviceListMetadata": {},
                            "deviceListMetadataVersion": 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: proto.Message.InteractiveMessage.Body.create({
                                text: txt
                            }),
                            header: proto.Message.InteractiveMessage.Header.create({
                                title: capt,
                                hasMediaAttachment: false
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                buttons: [
                                    {
                                        "name": "quick_reply",
                                        "buttonParamsJson": `{"display_text":"Views Tags","id": ".lihattags ${text}"}`
                                    }
                                ],
                            })
                        })
                    }
                }
            }, { userJid: m.chat, quoted: m });

            await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        }
        
        await m.react(''); // Clear reaction after processing
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, 'Failed to fetch information. Please try again later.', m);
        await m.react('❌'); // Emoji indicating failure
    }
};

handler.command = ["getcontact"];
handler.tags = ["premium", "hengker"];
handler.help = ["getcontact *<text>*"];
handler.premium = true;
handler.register = true;

module.exports = handler;