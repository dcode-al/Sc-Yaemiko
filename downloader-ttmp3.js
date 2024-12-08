let fetch = require('node-fetch')
let axios = require('axios')
let formData = require("form-data")

let handler = async (m, { conn, text, command }) => {
  if (!text) return conn.reply(m.chat, `• *Example :* .${command} https://vm.tiktok.com/xxxxx`, m)
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key }})
  let res = await tiktok2(text)
  let start = new Date();
  await conn.sendMessage(m.chat, { audio: { url: res.music }, mimetype: 'audio/mpeg' }, { quoted: m });
  return
}
handler.help = ['tiktokmp3 *<url>*'];
handler.tags = ['downloader'];
handler.command = /^(tiktokmp3d|ttmp3d|tiktokaudiod)$/i;
handler.limit = true;
handler.group = false;

module.exports = handler;

async function tiktok2(query) {
  return new Promise(async (resolve, reject) => {
    try {
    const encodedParams = new URLSearchParams();
encodedParams.set('url', query);
encodedParams.set('hd', '1');

      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: encodedParams
      });
      const videos = response.data.data;
        const result = {
          title: videos.title,
          cover: videos.cover,
          origin_cover: videos.origin_cover,
          no_watermark: videos.play,
          watermark: videos.wmplay,
          music: videos.music
        };
        resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}