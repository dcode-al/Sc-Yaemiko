/*
  *  Script By Indra
  *  Forbidden to share and delete my wm
  *  Breach : Indra
  *  WhatsApp : wa.me/6285325268412
*/

const captcha = require('@neoxr/captcha');
const crypto = require("crypto");
const PhoneNumber = require('awesome-phonenumber');
const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");

const handler = async (m, { conn }) => {
    try {
        conn.registrasi = conn.registrasi || {};
        if (conn.registrasi[m.chat]?.[m.sender]) return m.reply('Anda sudah meminta verifikasi sebelumnya.');
        let user = global.db.data.users[m.sender];
        if (user.registered === true) return conn.reply(m.chat, '```✅ Nomor Anda sudah terverifikasi.```', m);
        let sessionID = crypto.createHash("md5").update(m.sender).digest("hex");
        let newCaptcha = captcha();
        let image = Buffer.from(newCaptcha.image.split(',')[1], 'base64');
        let age = Math.floor(Math.random() * (60 - 18 + 1)) + 18;
        let today = new Date();
        let tanggal = today.toLocaleDateString("id-ID", {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        let ppUrl = await conn.profilePictureUrl(m.sender, 'image').catch(() => "https://telegra.ph/file/1dff1788814dd281170f8.jpg");
        
        let tteks = 'Verifikasi Berhasil\n\n';
        tteks += '```Name:```' + ` ${conn.getName(m.sender)}\n`;
        tteks += '```Age:```' + ` ${age}\n`;
        tteks += '```Number:```' + ` ${PhoneNumber('+' + m.sender.split('@')[0]).getNumber('international')}\n`;
        tteks += '```Date:```' + ` ${tanggal}\n`;
        tteks += `> View database *https://whatsapp.com/channel/0029VadOCDZ77qVOyhgaT23Z*\n\n`;
        tteks += `> _Powered By Yaemiko_`;
        await conn.sendMessage(m.chat, {
            text: tteks,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    showAdAttribution: true,
                    title: "Verifikasi Sukses",
                    body: 'Yaemiko-MD',
                    thumbnailUrl: ppUrl,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });

        // Notify about registration
        let notificationMsg = '```Registration Notification```\n\n';
        notificationMsg += `\`\`\`- Name: ${conn.getName(m.sender)}\`\`\`\n`;
        notificationMsg += `\`\`\`- Age: ${age}\`\`\`\n`;
        notificationMsg += `\`\`\`- Tags: @${m.sender.replace(/@.+/g, '')}\`\`\``;

        await conn.notify(notificationMsg);

        // Update user information
        user.name = conn.getName(m.sender).trim();
        user.age = age;
        user.regTime = +new Date;
        user.registered = true;

        // Cleanup registration session
        delete conn.registrasi[m.chat]?.[m.sender];
    } catch (error) {
        console.error('Error during registration:', error);
        m.reply('Terjadi kesalahan saat proses verifikasi. Silakan coba lagi nanti.');
    }
};

handler.help = ["verify", "@verify"];
handler.tags = ["start"];
handler.command = /^(verify|@verify)$/i;

module.exports = handler;