const fetch = require('node-fetch');

let handler = async (m, { conn }) => {
    // Cek apakah pengguna mengaktifkan lokasi pada perangkatnya
    if (!m.quoted || !m.quoted.isLocation) {
        return conn.reply(m.chat, 'Mohon kirimkan lokasi terkini Anda melalui pesan.', m);
    }

    try {
        // Ambil data lokasi dari pesan yang dikutip
        let locationData = m.quoted.location;
        let { degreesLatitude, degreesLongitude } = locationData;

        // Ambil thumbnail dari URL untuk lokasi
        let locationThumbnail = await (await fetch('https://telegra.ph/file/60b60aad1312a63d640a6.jpg')).buffer();

        // Kirim pesan berisi lokasi yang dikutip
        await conn.sendMessage(m.chat, {
            degreesLatitude,
            degreesLongitude,
            jpegThumbnail: locationThumbnail,
            contextInfo: { mentionedJid: [m.sender] }
        }, 'locationMessage', { quoted: m });

    } catch (error) {
        console.error(error);
        conn.reply(m.chat, 'Terjadi kesalahan saat memproses permintaan.', m);
    }
};

handler.help = ['sharelok'];
handler.tags = ['tools'];
handler.command = /^sharelok$/i;

module.exports = handler;