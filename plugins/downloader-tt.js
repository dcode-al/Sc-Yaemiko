const cheerio = require('cheerio');
const axios = require('axios');

let handler = async (m, { conn, text, args, command, usedPrefix }) => {
    let input = `[!] *wrong input*
    
Ex: ${usedPrefix + command} https://vt.tiktok.com/ZSYgBPSLD/`;

    if (!text) return m.reply(input);

    if (!(text.includes('http://') || text.includes('https://'))) 
        return m.reply(`URL invalid, please input a valid URL. Try with http:// or https://`);
    
    if (!text.includes('tiktok.com')) 
        return m.reply(`Invalid TikTok URL.`);
    
    try {
        const { isSlide, result, audio } = await tiktok(text);

        if (isSlide && Array.isArray(result)) {
            await m.reply('Tunggu kak image sedang di kirim');
            for (let img of result) {
                await conn.sendMessage(m.chat, { image: { url: img } });
                await conn.delay(1000);
            }
        } else {
            await m.reply('Tunggu kak video sedang dikirim');
            await conn.sendMessage(m.chat, { video: { url: result }, caption: 'Sukses by Furina:' }, { quoted: m });

            // Send audio if available
            if (audio) {
                await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: 'audio/mp4' }, { quoted: m });
            }
        }
    } catch (e) {
        m.reply('Error fetching data. Please try again later.');
        console.error("Error in handler:", e);
    }
};

handler.help = ['tiktok <url>', 'ttimg <url>', 'ttslide <url>', 'tiktokslide <url>'].map(v => v + ' (for video, image, and audio)');
handler.tags = ['downloader'];
handler.command = /^(tiktok|tt|tiktokdl|tiktoknowm|ttimg|ttslide|tiktokslide)$/i;
handler.register = true;
handler.limit = true;

module.exports = handler;

async function tiktok(url) {
    try {
        const data = new URLSearchParams({
            'id': url,
            'locale': 'id',
            'tt': 'RFBiZ3Bi'
        });

        const headers = {
            'HX-Request': true,
            'HX-Trigger': '_gcaptcha_pt',
            'HX-Target': 'target',
            'HX-Current-URL': 'https://ssstik.io/id',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
            'Referer': 'https://ssstik.io/id'
        };

        const response = await axios.post('https://ssstik.io/abc?url=dl', data, { headers });
        const html = response.data;
        const $ = cheerio.load(html);

        const author = $('#avatarAndTextUsual h2').text().trim();
        const title = $('#avatarAndTextUsual p').text().trim();
        const video = $('.result_overlay_buttons a.download_link').attr('href');
        const audio = $('.result_overlay_buttons a.download_link.music').attr('href');
        const imgLinks = [];
        
        $('img[data-splide-lazy]').each((index, element) => {
            const imgLink = $(element).attr('data-splide-lazy');
            imgLinks.push(imgLink);
        });

        return {
            isSlide: video ? false : true,
            author,
            title,
            result: video || imgLinks,
            audio
        };
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}