/*
  *  Script By Kemii
  *  Forbidden to share and delete my wm
  *  Facebook : kemii.houkii
  *  Github : dcodekemii
  *  Telegram : t.me/dcodekemi
  *  Breach : Kemii
  *  WhatsApp : wa.me/628816609112
*/

let handler = async (m, { conn, usedPrefix, command, text }) => {
    let kemii = ['6285325268412@s.whatsapp.net'].includes(m.sender);
    if (!kemii) return m.reply(`${m.name} 🤭`);
    
    let [id, nomer] = text.split(',');
    if (!id) return m.reply(`• *Example :* ${command}${usedPrefix} D1,08816609112`);
    if (!nomer) return m.reply(`• *Example :* ${command}${usedPrefix} D1,08816609112`);
    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });
    
    let refid = await Func.randomInt(1000, 100);
    let trx = await transaksi(id, nomer, refid);
    let edit = await m.reply(trx);
    
    let startTime = Date.now();
    let timeout = 30000;
    let cektrx = "";
    let status = "";

    while (Date.now() - startTime < timeout) {
        cektrx = await cektransaksi(id, nomer, refid);
        let statusRegex = /status\s*:\s*(\w+)/i;
        let match = cektrx.match(statusRegex);
        
        if (match && match[1].toLowerCase() === "sukses") {
            status = "sukses";
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (status === "sukses") {
        await conn.sendMessage(m.chat, { text: cektrx, edit: edit });
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    } else {
        await conn.sendMessage(m.chat, { text: cektrx, edit: edit });
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    }
}

handler.tags = ["owner"];
handler.help = ["topup"];
handler.command = ["topup"];

handler.owner = true;

module.exports = handler;

async function transaksi(id, nomer, refid) {
    try {
        let api = await Func.fetchJson(`https://h2h.okeconnect.com/trx?product=${id}&dest=${nomer}&refID=${refid}&memberID=${process.env.ORKUT_ID}&pin=${process.env.ORKUT_PIN}&password=${process.env.ORKUT_PASSWORD}`);
        return api;
    } catch (error) {
        return `Error saat melakukan transaksi: ${error.message}`;
    }
}

async function cektransaksi(id, nomer, refid) {
    try {
        let api = await Func.fetchJson(`https://h2h.okeconnect.com/trx?memberID=${process.env.ORKUT_ID}&pin=${process.env.ORKUT_PIN}&password=${process.env.ORKUT_PASSWORD}&product=${id}&dest=${nomer}&refID=${refid}`);
        return api;
    } catch (error) {
        return `Error saat mengecek transaksi: ${error.message}`;
    }
}