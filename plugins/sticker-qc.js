const WSF = require('wa-sticker-formatter');
const axios = require('axios');

let handler = async (m, { conn, args }) => {
    let text;
    if (args.length >= 1) {
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        return m.reply("Input teks atau reply teks yang ingin di jadikan quote!");
    }

    if (text.length > 100) {
        return m.reply("Maksimal 100 Teks!");
    }

    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png');

    // Function to create and return the image buffer
    const createImageBuffer = async (backgroundColor) => {
        const obj = {
            "type": "quote",
            "format": "png",
            "backgroundColor": backgroundColor,
            "width": 512,
            "height": 768,
            "scale": 2,
            "messages": [{
                "entities": [],
                "avatar": true,
                "from": {
                    "id": 1,
                    "name": m.name,
                    "photo": {
                        "url": pp
                    }
                },
                "text": text,
                "replyMessage": {}
            }]
        };

        const response = await axios.post('https://qc.botcahx.eu.org/generate', obj, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return Buffer.from(response.data.result.image, 'base64');
    };

    try {
        const whiteBuffer = await createImageBuffer("#ffffff");
        const blackBuffer = await createImageBuffer("#000000");

        // Create stickers
        let whiteSticker = await sticker5(whiteBuffer, false, global.packname, global.author);
        let blackSticker = await sticker5(blackBuffer, false, global.packname, global.author);

        if (whiteSticker) await conn.sendFile(m.chat, whiteSticker, 'QuoteWhite.webp', '', m);
        if (blackSticker) await conn.sendFile(m.chat, blackSticker, 'QuoteBlack.webp', '', m);
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat memproses permintaan.');
    }
};

handler.help = ['qc'];
handler.tags = ['sticker'];
handler.command = /^(qc|quotely)$/i;

module.exports = handler;

async function sticker5(img, url, packname, author, categories = ['']) {
    const stickerMetadata = {
        type: 'full',
        pack: packname,
        author,
        categories,
    };
    return await new WSF.Sticker(img ? img : url, stickerMetadata).build();
}