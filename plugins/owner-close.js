const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
    let verif = {
        key: {
            participant: '0@s.whatsapp.net',
            remoteJid: "0@s.whatsapp.net"
        },
        message: {
            conversation: "Powered By _ICSF Team_"
        }
    };

    let groupId = args[0]; // assuming the group ID is passed as the first argument
    if (!groupId) {
        return m.reply('Please provide the group ID.');
    }

    let msg = generateWAMessageFromContent(groupId, {
        viewOnceMessage: {
            message: {
                "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    contextInfo: {
                        mentionedJid: [m.sender],
                        isForwarded: false,
                        externalAdReply: {
                            title: 'DCODEKEMII',
                            thumbnailUrl: 'https://telegra.ph/file/a6f3ef42e42efcf542950.jpg',
                            sourceUrl: 'https://youtube.com/shorts/eHM3CMiAQ9Y?si=sqJQ1gyRAnptIK0m',
                            mediaType: 2,
                            renderLargerThumbnail: false
                        }
                    },
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: `Group Has Been Closed By, @${m.sender.replace(/@.+/g, '')}!`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({}),
                    header: proto.Message.InteractiveMessage.Header.create({
                        subtitle: "test",
                        hasMediaAttachment: false
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": "{\"display_text\":\"Kemii-san 🐼\",\"id\":. owner}"
                            }
                        ]
                    })
                })
            }
        }
    }, { quoted: verif });

    await conn.relayMessage(groupId, msg.message, {
        messageId: msg.key.id
    });

    // Kill the group
    let groupMetadata = await conn.groupMetadata(groupId);
    let groupAdmins = groupMetadata.participants.filter(v => v.isAdmin).map(i => i.jid);
    let isAdmin = groupAdmins.includes(m.sender);

    if (!isAdmin) {
        return m.reply('Only group admins can kill the group.');
    }

    await conn.groupKill(groupId).then(() => {
        conn.reply(m.chat, `Successfully killed ${groupMetadata.subject} group and left the group.`, m);
    }).catch(e => {
        console.error(e);
        conn.reply(m.chat, `Error: ${e.message}`, m);
    });
};

handler.help = ["close"];
handler.tags = ["owner"];
handler.command = ["close"];
handler.register = true;
handler.owner = true;
handler.group = true;

module.exports = handler;