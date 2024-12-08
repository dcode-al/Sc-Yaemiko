const uploadImage = require('../lib/uploadImage');
const { MessageType } = require('@whiskeysockets/baileys');

let handler = async (m, { conn, text }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime) return conn.reply(m.chat, `Send/Reply Images with the caption *.ocr*`, m);
    if (!/image\/(jpe?g|png)/.test(mime)) throw `_*jenis ${mime} tidak didukung!*_`;

    let img = await q.download();
    let url = await uploadImage(img);
    
    // Prepare the API endpoint and query parameters
    const apiKey = 'furinafree'; // Your API key
    const apiUrl = `https://ndra-furinaa-api.vercel.app/api/Gemini-vision?text=Ambilkan%20text%20yang%20ada%20di%20situ&url=${encodeURIComponent(url)}&apiKey=${apiKey}`;
    
    // Fetch text from the API
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error fetching OCR data');
        
        const data = await response.json();
        // Extract the relevant text from the API response
        const extractedText = data.result.data || 'Tidak ada teks yang ditemukan.';

        await m.reply(`Hasil OCR:\n\n${extractedText}\n\`\`\``);
    } catch (error) {
        console.error(error);
        await m.reply('Gagal mengambil teks dari gambar. Silakan coba lagi.');
    }
};

handler.help = ['ocr', 'totext'].map(v => v + ' *<image>*');
handler.tags = ['tools'];
handler.command = /^(ocr|totext)$/i;
handler.limit = true;

module.exports = handler;