const axios = require('axios');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

let handler = async (m, { conn, args, text }) => {
    var arr = ["atas", "bawah"];
    if (!arr.includes(args[0])) throw "Pilih Atas Atau Bawah? format .putarkoin atas/bawah";
    
    var terbang = getRandom(arr);
    var res;
    var pesan;
    var stiker;
    var MiliSecond = 3000; // 3 seconds

    let coins = parseInt(Math.floor(Math.random() * 100000));
    let exp = parseInt(Math.floor(Math.random() * 10000));
    let player = global.db.data.users[m.sender];

    if (terbang === "atas") {
        res = "https://cdn-icons-png.flaticon.com/512/1490/1490832.png";
        stiker = await createSticker(false, res, 'wm', 'author', 30);
        await m.reply(stiker);

        pesan = `*[ Menang ]*

Kamu Mendapatkan:
${new Intl.NumberFormat('en-US').format(coins)} Money
${new Intl.NumberFormat('en-US').format(exp)} XP
`;

        setTimeout(function() {
            conn.reply(m.chat, pesan, m);
        }, MiliSecond);

        player.money += coins;
        player.exp += exp;
        global.db.data.users[m.sender].tiketcoin += 1;

    } else if (terbang === "bawah") {
        res = "https://cdn-icons-png.flaticon.com/512/4315/4315581.png";
        stiker = await createSticker(false, res, 'wm', 'author', 30);
        await m.reply(stiker);

        pesan = `*[ Kalah ]*

Kamu Kehilangan::
${new Intl.NumberFormat('en-US').format(coins)} Money
${new Intl.NumberFormat('en-US').format(exp)} XP
`;

        setTimeout(function() {
            conn.reply(m.chat, pesan, m);
        }, MiliSecond);

        player.money -= coins;
        player.exp -= exp;
        global.db.data.users[m.sender].tiketcoin -= 1;
    }
};

handler.help = ["putarkoin"];
handler.tags = ["rpg"];
handler.command = /^(putarkoin)$/i;
module.exports = handler;

async function createSticker(img, url, wm, author, quality) {
    let stickerMetadata = {
        type: 'full',
        pack: wm,
        author: author,
        quality
    };
    return (new Sticker(img ? img : url, stickerMetadata)).toBuffer();
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}