const uploadImage = require("../lib/uploadFile");

let handler = async (m, { conn, args }) => {
    let text;

    if (args.length >= 1) {
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        return m.reply("• *Example:* .gemini selamat pagi");
    }

    await m.react('🕒');

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || "";

    if (!mime) {
        try {
            let res = await gemini(text);
            console.log('Gemini API response:', res); // Logging response for debugging
            if (res && res.result && res.result.data) {
                await conn.sendMessage(m.chat, {
                    text: res.result.data,
                    contextInfo: {
                        externalAdReply: {
                            title: 'GEMINI-PRO / VISION',
                            thumbnailUrl: 'https://telegra.ph/file/4bae3d5130aabcbe94588.jpg',
                            sourceUrl: 'https://gemini.google.com',
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: m });
            } else {
                m.reply('Unexpected response format from Gemini API.');
            }
        } catch (error) {
            m.reply('Error processing your request.');
            console.error('Gemini API error:', error); // Improved error logging
        }
    } else {
        try {
            let media = await q.download();
            let isTele = /image\/(png|jpe?g)/.test(mime);
            let link = await uploadImage(media);
            let res = await geminivisi(text, link);
            console.log('Gemini Vision API response:', res); // Logging response for debugging
            if (res && res.result && res.result.data) {
                await conn.sendMessage(m.chat, {
                    text: res.result.data,
                    contextInfo: {
                        externalAdReply: {
                            title: 'GEMINI-PRO / VISION',
                            thumbnailUrl: link,
                            sourceUrl: 'https://gemini.google.com',
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: m });
            } else {
                m.reply('Unexpected response format from Gemini Vision API.');
            }
        } catch (error) {
            m.reply('Error processing your request.');
            console.error('Gemini Vision API error:', error); // Improved error logging
        }
    }
};

handler.help = ["gemini"].map(a => a + " *<text>*");
handler.tags = ["ai", "premium"];
handler.command = /^(gemini)$/i;
handler.premium = true;
handler.register = true;
module.exports = handler;

async function gemini(text) {
    try {
        let response = await Func.fetchJson(`https://ndra-furinaa-api.vercel.app/api/Gemini?text=${encodeURIComponent(text)}&apiKey=indrafarida`);
        console.log('Gemini API response:', response); // Logging response for debugging
        return response;
    } catch (error) {
        console.error('Error fetching Gemini data:', error);
        throw new Error('Failed to fetch Gemini data');
    }
}

async function geminivisi(text, url) {
    try {
        let response = await Func.fetchJson(`https://ndra-furinaa-api.vercel.app/api/Gemini-vision?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&apiKey=indrafarida`);
        console.log('Gemini Vision API response:', response); // Logging response for debugging
        return response;
    } catch (error) {
        console.error('Error fetching Gemini Vision data:', error);
        throw new Error('Failed to fetch Gemini Vision data');
    }
}