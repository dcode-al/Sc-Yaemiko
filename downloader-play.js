const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const os = require('os');
const { ytdl } = require('../lib/scrape/ai');

const streamPipeline = promisify(pipeline);

var handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw `Gunakan contoh ${usedPrefix}${command} <judul lagu>`;

  try {
    await conn.reply(m.chat, "Sedang mencari dan mengunduh audio...", m);

    // Menggunakan ytdl untuk mengambil detail video
    const result = await ytdl(text);

    if (result.error) {
      throw `Gagal mendapatkan detail video: ${result.message}`;
    }

    const { data } = result;
    const { title, thumbnail, formats } = data; 

    const audioFormat = formats.find(format => format.acodec !== 'none' && format.vcodec === 'none');
    if (!audioFormat) throw 'Tidak ditemukan format audio yang sesuai.';

    const { url, ext } = audioFormat;
    const buffer = await axios.get(thumbnail, { responseType: 'arraybuffer' }).then(res => res.data);

    await conn.sendMessage(m.chat, {
      text: `「 *Informasi Video* 」\n\n📝 *Title:* ${title}\n🃏 *Format:* ${ext}`,
      contextInfo: {
        externalAdReply: {
          title: `🎬 ${title}`,
          body: 'Klik di sini untuk mengunduh audio',
          thumbnailUrl: thumbnail,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });

    const audioResponse = await axios.get(url, { responseType: 'stream' });

    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const tmpDir = os.tmpdir();
    const audioFilePath = `${tmpDir}/${randomNumber}.${ext}`;

    const writableStream = fs.createWriteStream(audioFilePath);
    await streamPipeline(audioResponse.data, writableStream);

    let audioMessage = {
      audio: {
        url: audioFilePath
      },
      mimetype: 'audio/mp4',
      fileName: `${title}.${ext}`,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 2,
          mediaUrl: url,
          title: title,
          body: 'Play 🎵',
          sourceUrl: url,
          thumbnailUrl: thumbnail
        }
      }
    };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });

    fs.unlink(audioFilePath, (err) => {
      if (err) {
        console.error(`Gagal menghapus file audio: ${err}`);
      } else {
        console.log(`File audio dihapus: ${audioFilePath}`);
      }
    });

  } catch (err) {
    console.error(err);
    await conn.reply(m.chat, `Terjadi kesalahan: ${err.message}`, m);
  }
};

handler.help = ['play'].map((v) => v + ' <query>');
handler.tags = ['downloader'];
handler.command = /^(play)$/i;

module.exports = handler;