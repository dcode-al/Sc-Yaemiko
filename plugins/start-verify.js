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
        let name = registered ? global.db.data.users[m.sender].name : conn.getName(m.sender)
        let user = global.db.data.users[m.sender];
        let ucap = ucapan()
        if (user.registered === true) return conn.reply(m.chat, '```✅ Nomor Anda sudah terverifikasi.```', m);

        // Generate a unique session ID for this registration attempt
        let sessionID = crypto.createHash("md5").update(m.sender).digest("hex");

        // Generate captcha
        let newCaptcha = captcha();
        let image = Buffer.from(newCaptcha.image.split(',')[1], 'base64');

        // Generate random age between 18 and 60
        let age = Math.floor(Math.random() * (60 - 18 + 1)) + 18;

        // Format success message
        let today = new Date();
        let tanggal = today.toLocaleDateString("id-ID", {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        let ppUrl = await conn.profilePictureUrl(m.sender, 'image').catch(() => "https://telegra.ph/file/1dff1788814dd281170f8.jpg");

        let tteks = '乂  *R E G I S T E R  S U C C E S S*\n\n';
        tteks += `┌  ◦ *Name* : ${conn.getName(m.sender)}\n`;
        tteks += `│  ◦ *Age* :   ${age}\n`;
        tteks += `│  ◦ *Number* : ${PhoneNumber('+' + m.sender.split('@')[0]).getNumber('international')}\n`;
        tteks += `└  ◦ *Date: ${tanggal}\n`;
        tteks += `Cek Database Di Saluran\n\n`;
        tteks += `Regis By Yaemiko`;

        await conn.sendMessage(m.chat, {
            text: tteks,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    showAdAttribution: true,
                    title: namebot,
                    body: 'Version: 3.0.1',
                    thumbnailUrl: ppUrl,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }, forwardedNewsletterMessageInfo: {
                  newsletterName: `${global.salurannama}`,
                  newsletterJid: newsletterId
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

function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH');
    let res = "Malam";
    if (time >= 4) {
        res = "Pagi";
    }
    if (time > 10) {
        res = "Siang";
    }
    if (time >= 15) {
        res = "Sore";
    }
    if (time >= 18) {
        res = "Malam";
    }
    return res;
}