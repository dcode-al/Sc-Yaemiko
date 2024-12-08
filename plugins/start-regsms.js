const fetch = require('node-fetch');

let handler = async function (m, { conn, args, usedPrefix, command }) {
    let users = global.db.data.users[m.sender];
    let name = await conn.getName(m.sender);

    if (users.registered === true) {
        return conn.reply(m.chat, '✅ Nomor Kamu Udah Terverifikasi', m);
    }
    
    if (!args || !args[0]) {
        return conn.reply(m.chat, `• *Example :* .${command} 6288980870067`, m);
    }
    
    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    let code = `${getRandomInt(100, 900)}-${getRandomInt(100, 900)}`;
    let kemii = conn.user.jid.split("@")[0];

    users.codeExpire = new Date() * 1;
    users.code = code;
    users.nomer = args[0];
    
    await fetch("https://2vgq8p.api.infobip.com/sms/2/text/advanced", {
        method: "POST",
        headers: {
            "Authorization": "App 042d43774fb4f49d048dbea058a621ff-f4532def-bda8-46ce-ba2d-df7878f96b87",
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "messages": [
                {
                    "destinations": [{ "to": `${args[0]}` }],
                    "from": "6282179287991", // Nomor pengirim yang ingin digunakan
                    "text": `Halo ${name},\nMasukkan kode verifikasi berikut ke chat bot:\nKode: ${code}\n\nJangan bagikan kode ini. Hubungi dukungan jika ada masalah.\n\nTerima kasih.\nCopyright © Yaemiko`
                }
            ]
        }),
        redirect: "follow"
    })
    .then(response => response.text())
    .then(() => {
        return conn.reply(m.sender, '✅ Kode Sudah Terkirim \nCek SMS Untuk Melanjutkan Verifikasi!', m);
    })
    .catch(error => {
        console.error('Error sending SMS:', error);
        return conn.reply(m.sender, '❌ Gagal mengirim SMS. Coba lagi nanti.', m);
    });
}

handler.help = ['regsms *<number>*'];
handler.tags = ['start'];
handler.command = /^(regsms|regphone)$/i;
handler.private = false;

module.exports = handler;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}