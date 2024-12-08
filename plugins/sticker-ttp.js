const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function ttp(text, tcolor = "30F4EF") {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: `https://www.picturetopeople.org/p2p/text_effects_generator.p2p/transparent_text_effect`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                "Cookie": "_ga=GA1.2.1667267761.1655982457; _gid=GA1.2.77586860.1655982457; __gads=ID=c5a896288a559a38-224105aab0d30085:T=1655982456:RT=1655982456:S=ALNI_MbtHcmgQmVUZI-a2agP40JXqeRnyQ; __gpi=UID=000006149da5cba6:T=1655982456:RT=1655982456:S=ALNI_MY1RmQtva14GH-aAPr7-7vWpxWtmg; _gat_gtag_UA_6584688_1=1"
            },
            formData: {
                'TextToRender': text,
                'FontSize': '100',
                'Margin': '30',
                'LayoutStyle': '0',
                'TextRotation': '0',
                'TextColor': `ffffff`,
                'TextTransparency': '0',
                'OutlineThickness': '3',
                'OutlineColor': '000000',
                'FontName': 'Lekton',
                'ResultType': 'view'
            }
        };
        
        request(options, function(error, response, body) {
            if (error) return reject(error);
            const $ = cheerio.load(body);
            const result = 'https://www.picturetopeople.org' + $('#idResultFile').attr('value');
            resolve({ status: 200, result: result });
        });
    });
}

let handler = async (m, { conn, text }) => {
    if (!text) throw '• *Example :* .ttp Hello';

    // Mengirim reaksi
    conn.sendMessage(m.chat, {
        react: {
            text: '🕒',
            key: m.key,
        }
    });

    // Mendapatkan hasil dari ttp
    const result = await ttp(text);
    if (result.status === 200) {
        // Mengambil gambar dari URL
        const imageUrl = result.result;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Menyimpan gambar sebagai WEBP
        const filePath = path.join(__dirname, 'temp.webp');
        fs.writeFileSync(filePath, response.data);

        // Mengirim gambar sebagai stiker
        await conn.sendFile(m.chat, filePath, 'kemii.webp', '', m, false, { asSticker: true });

        // Menghapus file setelah pengiriman
        fs.unlinkSync(filePath);
    } else {
        throw 'Terjadi kesalahan saat mengambil data.';
    }
}

handler.help = ['ttp <teks>'];
handler.tags = ['sticker'];
handler.command = /^(ttp)$/i;
handler.limit = true;
handler.premium = false;

module.exports = handler;