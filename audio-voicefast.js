const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!/audio/.test(mime)) throw `Reply Audio With Command Example: *${usedPrefix + command}*`;
        let audio = await q.download();
        if (!audio) throw 'Can\'t download audio!';

        let set;
        if (/1\.5x/.test(command)) set = '-filter:a "atempo=1.5,asetrate=44100"';
        if (/2x/.test(command)) set = '-filter:a "atempo=2,asetrate=44100"';
        if (/3x/.test(command)) set = '-filter:a "atempo=3,asetrate=44100"';

        let ran = (new Date() * 1) + '.mp3';
        let media = path.join(__dirname, '../tmp/', ran);
        let filename = path.join(__dirname, '../tmp/', ran + '.mp3');

        await fs.promises.writeFile(media, audio);

        exec(`ffmpeg -i ${media} ${set} ${filename}`, async (err) => {
            await fs.promises.unlink(media);
            if (err) return conn.reply(m.chat, 'Error processing audio', m);
            let buff = await fs.promises.readFile(filename);
            conn.sendFile(m.chat, buff, ran, null, m, /vn/.test(args[0]), { quoted: m, mimetype: 'audio/mp4' });
            await fs.promises.unlink(filename);
        });
    } catch (e) {
        conn.reply(m.chat, e.message, m);
    }
};

handler.help = ['1.5x <vn>', '2x <vn>', '3x <vn>'];
handler.tags = ['audio'];
handler.command = /^(1\.5x|2x|3x)$/i;
handler.limit = true;

module.exports = handler;