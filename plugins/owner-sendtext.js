const fs = require('fs');
const { proto } = require("@whiskeysockets/baileys");
const moment = require('moment'); // Ensure you have moment.js installed

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply("Text harus disediakan.");

    const newsletterId = '120363299719848392@newsletter';
    const name = 'Powered By Yaemiko';

    conn.notify = async (text) => {
        const ppUrl = await conn.profilePictureUrl(m.sender, 'image').catch((_) => "https://telegra.ph/file/1dff1788814dd281170f8.jpg");

        const contextInfo = {
            mentionedJid: conn.parseMention(text),
            externalAdReply: {
                title: 'System Notifications',
                body: `${moment().format('DD/MM/YY HH:mm:ss')}`,
                thumbnailUrl: ppUrl,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
            },
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
                newsletterJid: newsletterId,
                newsletterName: name,
                serverMessageId: -1
            }
        };

        let messages = {
            extendedTextMessage: {
                text: text,
                contextInfo: contextInfo
            }
        };

        let messageToChannel = proto.Message.encode(messages).finish();

        let result = {
            tag: 'message',
            attrs: { to: newsletterId, type: 'text' },
            content: [
                {
                    tag: 'plaintext',
                    attrs: {},
                    content: messageToChannel
                }
            ]
        };

        return conn.query(result);
    };

    try {
        await conn.notify(text);
        m.reply("Pesan berhasil dikirim ke saluran.\n> Link saluran https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C");
    } catch (error) {
        console.error("Error saat mengirim pesan:", error);
        m.reply("Terjadi kesalahan saat mengirim pesan.");
    }
};

handler.command = /^(sendtext|stch)$/i;
handler.tags = ['owner'];
handler.help = ['sendtext', ''];
handler.owner = true;

module.exports = handler;