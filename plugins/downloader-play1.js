const ytSearch = require('yt-search');
const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan judul lagu!\n\nContoh:\n${usedPrefix + command} Komang`;

    await conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } });

    try {
        // Search YouTube for the title
        const searchResults = await ytSearch(text);
        if (!searchResults.videos.length) throw new Error('Lagu tidak ditemukan.');
        
        // Get the first video result
        const video = searchResults.videos[0];
        const { title, url, thumbnail, duration, author: { name: creator } } = video;

        // Fetch the audio URL using an external API
        const response = await axios.get(`https://api.alyachan.dev/api/yta?url=${encodeURIComponent(url)}&apikey=ForxFyyre`);
        
        if (response.status !== 200 || !response.data) throw new Error('Gagal mendownload audio.');

        // Extract data from API response
        const { data: { url: media }, size } = response.data;

        const bitrates = ['128kbps', '192kbps', '256kbps', '320kbps'];
        const randomBitrate = bitrates[Math.floor(Math.random() * bitrates.length)];

        // Detail message
        let detailMessage = `「 *Detail Video* 」\n\n` +
            `📝 *Title:* ${title}\n` +
            `🎶 *Bitrate:* ${randomBitrate}\n` +
            `🎦 *Duration:* ${duration}\n` +
            `👤 *Author:* ${creator}\n` +
            `🔗 *URL:* ${url}\n\n` +
            `📸 *Thumbnail:* ${thumbnail}`;

        // Send video details
        await conn.sendMessage(m.chat, { 
            text: detailMessage, 
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: 'Click here for more details',
                    thumbnailUrl: thumbnail,
                    sourceUrl: url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });

        // Send audio file
        await conn.sendMessage(m.chat, { 
            audio: { url: media }, 
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            caption: `🎧 Downloading your audio...`,
            ptt: false
        }, { quoted: m });

    } catch (error) {
        m.reply('Terjadi kesalahan saat memproses permintaan.');
        console.error(error);
    }
};

handler.help = ['play1'];
handler.command = /^(play1)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

module.exports = handler;