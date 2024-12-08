const handler = async (m, { conn, text }) => {
    let user = global.db.data.users[m.sender];
    const now = Date.now();
    if (user.premium && user.premiumTime < now) {
        user.premium = false;
        return conn.reply(m.chat, "Maaf waktu Premium anda telah habis!\n\nSilahkan hubungi owner untuk perpanjang waktu Premium!", m);
    }

    const hargaPremium = { "3": 3000, "15": 7000 };
    const input = text.trim();
    if (!input) {
        let msgg = new Button()
            .setBody("Silahkan pilih Paket premium sesuai kebutuhan anda")
            .setFooter('2024')
            .setTitle('Powered By Indraa')
            .setImage('https://telegra.ph/file/6c7b9ffbdfb0096e1db3e.jpg')
            .addSelection("Tap Here!")
            .makeSections("", "");
        msgg.makeRow("", '[ Premium 3 Hari ]', `Rp 3.000`, `.buyprem 3`);
        msgg.makeRow("", '[ Premium 15 Hari ]', `Rp 7.000`, `.buyprem 15`);
        await msgg.run(m.chat, conn, m);
        return;
    }

    const harga = hargaPremium[input];
    if (!harga) return conn.reply(m.chat, "*pilihan harga mu gak valid.*", m);

    let confirmMsg = new Button()
        .setBody("Apakah anda yakin?")
        .setFooter('2024')
        .setTitle('Powered By Indraa')
        .setImage('https://telegra.ph/file/6c7b9ffbdfb0096e1db3e.jpg')
        .addSelection("Tap Here!")
        .makeSections("", "");
    confirmMsg.makeRow("", '[ Yakin ]', ``, `.buyprem yes`);
    confirmMsg.makeRow("", '[ Batalkan ]', ``, `.buyprem no`);
    let { key } = await confirmMsg.run(m.chat, conn, m);

    conn.buyprem[m.chat] = {
        list: input,
        hargaPremium,
        key,
        timeout: setTimeout(() => {
            conn.sendMessage(m.chat, { delete: key });
            delete conn.buyprem[m.chat];
        }, 60 * 1000)
    };
};

handler.before = async (m, { conn }) => {
    conn.buyprem = conn.buyprem || {};
    if (m.isBaileys || !(m.chat in conn.buyprem)) return;

    let user = global.db.data.users[m.sender];
    const input = m.text.trim().toLowerCase();
    if (!/^\.buyprem (yes|no)$/.test(input)) return;

    const { list, key, hargaPremium, timeout } = conn.buyprem[m.chat];
    const harga = hargaPremium[list];
    if (!m.quoted || m.quoted.id !== key.id || !m.text) return;

    if (input === '.buyprem yes') {
        if (user.saldo < harga) {
            m.reply(`> » Saldo kamu tidak cukup, minimal *Rp:${harga}* untuk beli premium.\n\nSilahkan hubungi owner untuk isi saldo`);
        } else {
            user.saldo -= harga;
            user.premiumTime = (user.premiumTime || now) + 86400000 * list;
            user.premium = true;

            conn.reply(m.chat, `🎉 *Selamat! Anda sekarang pengguna premium.* 🎉\n⏳ *Countdown:* ${getCountdownText(now, user.premiumTime)}`, m);
            conn.sendMessage(m.chat, { delete: key });
            clearTimeout(timeout);
            delete conn.buyprem[m.chat];
        }
    } else if (input === '.buyprem no') {
        conn.reply(m.chat, "Pembelian dibatalkan.", m);
        conn.sendMessage(m.chat, { delete: key });
        clearTimeout(timeout);
        delete conn.buyprem[m.chat];
    }
};
handler.help = ["buyprem"];
handler.tags = ["saldo"];
handler.command = /^buyprem$/i;

module.exports = handler;

function getCountdownText(now, premiumTime) {
    let remainingTime = premiumTime - now;
    let days = Math.floor(remainingTime / 86400000);
    let hours = Math.floor((remainingTime % 86400000) / 3600000);
    let minutes = Math.floor((remainingTime % 3600000) / 60000);
    let seconds = Math.floor((remainingTime % 60000) / 1000);

    return `${days > 0 ? `${days} hari ` : ''}${hours > 0 ? `${hours} jam ` : ''}${minutes > 0 ? `${minutes} menit ` : ''}${seconds > 0 ? `${seconds} detik` : ''}`.trim();
}