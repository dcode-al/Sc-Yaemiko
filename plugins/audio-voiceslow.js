const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!/audio/.test(mime)) throw `Reply Audio With Command Example: *${usedPrefix + command} <0.5-0.9>*`;

        let speed = parseFloat(command.split('x')[0]);
        if (!speed || speed < 0.5 || speed > 0.9) throw 'Please provide a valid speed between 0.5 and 0.9!';

        let audio = await q.download();
        if (!audio) throw 'Can\'t download audio!';

        let ran = (new Date() * 1) + '.mp3';
        let media = path.join(__dirname, '../tmp/' + ran);
        let filename = media + '.mp3';

        await fs.promises.writeFile(media, audio);

        let set = `-filter:a "atempo=${speed},asetrate=44100"`;

        conn.sendMessage(m.chat, { react: '🔊', text: 'Processing audio...' }, m);

        exec(`ffmpeg -i ${media} ${set} ${filename}`, async (err) => {
            await fs.promises.unlink(media);
            if (err) throw `Error processing audio: ${err}`;

            let buff = await fs.promises.readFile(filename);
            conn.sendFile(m.chat, buff, ran, null, m, /vn/.test(args[0]), { quoted: m, mimetype: 'audio/mp4' });

            await fs.promises.unlink(filename);

            conn.sendMessage(m.chat, { react: '✅', text: 'Audio processed successfully!' }, m);
        });
    } catch (e) {
        throw e;
    }
};

handler.help = ['0.5x <vn>', '0.6x <vn>', '0.7x <vn>', '0.8x <vn>', '0.9x <vn>'];
handler.tags = ['audio'];
handler.command = /^(0\.5x|0\.6x|0\.7x|0\.8x|0\.9x)$/i;
handler.limit = true;

module.exports = handler;