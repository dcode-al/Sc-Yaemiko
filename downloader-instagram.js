const axios = require('axios');
const cheerio = require('cheerio');

const types = ['photo', 'video'];

async function indown(urls, type) {
    const url = 'https://indownloader.app/request';
    const data = new URLSearchParams();
    data.append('link', urls);
    data.append('downloader', type);

    const headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'MyApp/1.0',
        'X-Requested-With': 'XMLHttpRequest'
    };

    try {
        const response = await axios.post(url, data.toString(), { headers });
        const html = response.data.html;
        const $ = cheerio.load(html);

        const thumbnailUrl = $('.post-thumb img').attr('src');
        const videoUrl = $('.download-options a').attr('href');

        return {
            thumbnail: thumbnailUrl,
            video: videoUrl
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Gunakan contoh ${usedPrefix}${command} https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link`;
    m.reply('Tunggu sebentar...');
    const url = args[0];

    try {
        const type = url.includes('/p/') ? 'photo' : 'video'; // Menentukan jenis berdasarkan URL
        const result = await indown(url, type);

        if (result.video) {
            await conn.sendFile(m.chat, result.video, 'video.mp4', `*Instagram Downloader*`, m);
        } else if (result.thumbnail) {
            await conn.sendFile(m.chat, result.thumbnail, 'image.jpg', `*Instagram Downloader*`, m);
        } else {
            throw 'Gagal mendapatkan data. Coba lagi nanti.';
        }
    } catch (err) {
        console.error(err);
        m.reply(`Error: ${err.message}`);
    }
};

handler.help = ['ig', 'igdl', 'instagram'].map(v => v + ' *<url>*');
handler.tags = ['downloader'];
handler.command = /^(ig|igdl|instagram)$/i;

module.exports = handler;