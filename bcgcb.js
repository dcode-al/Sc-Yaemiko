const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");

async function broadcastMessage(conn, m) {
    let groups = Object.entries(conn.chats).filter(([jid, chat]) => 
        jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce
    ).map(v => v[0]);

    conn.reply(m.chat, `_Sending broadcast message to ${groups.length} groups_`, m);

    for (let id of groups) {
        let msg = generateWAMessageFromContent(id, {
            viewOnceMessage: {
                message: {
                    "messageContextInfo": {
                        "deviceListMetadata": {},
                        "deviceListMetadataVersion": 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: m.text
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: ""
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            title: "",
                            subtitle: "BROADCAST",
                            hasMediaAttachment: false
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: [{
                                "name": "cta_url",
                                "buttonParamsJson": "{\"display_text\":\"Owner 📞\",\"url\":\"https://wa.me/6285325268412\",\"merchant_url\":\"https://wa.me/6285325268412\"}"
                            },
                            {
                                "name": "cta_url",
                                "buttonParamsJson": "{\"display_text\":\"Bot Channel 🌐\",\"url\":\"https://whatsapp.com/channel/0029VaYVlVP9hXF9Ig83hJ3L\",\"merchant_url\":\"www.google.com\"}"
                            }]
                        })
                    })
                }
            }
        }, { quoted: m });

        await conn.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
        });
    }

    conn.reply(m.chat, '_Successfully sent broadcast message to all groups!_', m);
}

let handler = async (m, { conn }) => {
    await broadcastMessage(conn, m);
};

handler.command = ['bcgcbutton', 'bcgcb'];
handler.tags = ['owner'];
handler.help = ['bcgcbutton <text>', 'bcgcb <text>'];
handler.owner = true;

module.exports = handler;