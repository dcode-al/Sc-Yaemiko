const ytSearch = require('yt-search');
const y2mate = require('../lib/y2mate');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Contoh penggunaan: ${usedPrefix + command} <query>`;

    const searchQuery = text.trim();
    try {
        await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

        const searchResults = await ytSearch(searchQuery);
        if (!searchResults.videos.length) throw 'Video tidak ditemukan.';

        const video = searchResults.videos[0];

        const audioData = await y2mate.mp3(video.url);
        if (!audioData.status) throw new Error('Gagal mendownload audio.');

        const detailMessage = `「 *Detail Video* 」\n\n` +
            `📝 *Title:* ${audioData.title}\n` +
            `🎶 *Quality:* 128kbps\n` +
            `🎦 *Durasi:* ${video.timestamp}\n` +
            `👤 *Author:* ${video.author.name}`;

        await conn.sendMessage(m.chat, {
            text: detailMessage,
            contextInfo: {
                externalAdReply: {
                    title: audioData.title,
                    body: video.description || 'Click here for more details',
                    thumbnailUrl: audioData.thumbnail,
                    sourceUrl: video.url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });

        await conn.sendMessage(m.chat, {
            audio: { url: audioData.media },
            mimetype: 'audio/mp4'
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        if (e.message.includes('Video tidak ditemukan')) {
            throw '❌ Gagal mendownload audio!';
        } else {
            conn.reply(m.chat, 'An error occurred: ' + e.message, m);
        }
    }
};

handler.help = ["play"];
handler.tags = ["music"];
handler.command = /^play$/i;

module.exports = handler;