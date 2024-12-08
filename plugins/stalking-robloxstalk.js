// Indra Ganteng
// Sab, 14 Sep 14.53
// Dont delete my wm

let { robloxstalk } = require('../lib/scrape/ai');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `*Example :* ${usedPrefix + command} indra`, m);    
    await m.react('⏱️');
    try {
        let Indra = await robloxstalk(text);
        if (Indra.status && Indra.Indraa) {
            let hasil = Indra.Indraa;
            let teks = 'Roblox Stalk\n\n';
            teks += '```Name:```' + ` ${hasil.displayName}\n`;
            teks += '```Username:```' + ` ${hasil.name}\n`;
            teks += '```isBanned:```' + ` ${hasil.isBanned}\n`;
            teks += '```Verified:```' + ` ${hasil.hasVerifiedBadge}\n`;
            teks += '```ID:```' + ` ${hasil.id}\n`;
            teks += '```Created:```' + ` ${hasil.created}\n`;
            teks += '```LastOnline:```' + ` ${Indra.lastOnline}\n`;
            teks += '```Desc:```' + ` ${hasil.description || 'Tidak ada deskripsi'}`;

            await conn.sendFile(m.chat, Indra.profileDetails, '', teks, m);
        } else {
            conn.reply(m.chat, `User tidak ditemukan atau data tidak lengkap.`, m);
        }
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `Terjadi kesalahan saat mengambil data.`, m);
    }
};

handler.help = ['robloxstalk *<text>*'];
handler.tags = ['stalking'];
handler.command = /^(robloxstalk|rbstalk)$/i;
handler.limit = true;
handler.register = true;

module.exports = handler;