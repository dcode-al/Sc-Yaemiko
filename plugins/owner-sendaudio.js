const { generateWAMessageFromContent, proto, MessageType } = require('@whiskeysockets/baileys');

const handler = async (m, { conn }) => {
    if (!m.quoted) return m.reply("Balas pesan audio yang ingin dikirim.");

    try {
        // Unduh media dari pesan yang dibalas
        let media = await m.quoted.download();
        const jid = '120363299719848392@newsletter';

        // Siapkan pesan WAMessage dari media
        const audioMessage = {
            audioMessage: {
                url: media,
                mimetype: 'audio/mp4',
                ptt: true
            }
        };

        // Generate pesan WAMessage dari audioMessage
        const message = generateWAMessageFromContent(jid, proto.Message.fromObject({
            audioMessage
        }), {});

        // Kirim pesan audio ke saluran
        await conn.sendMessage(jid, message, MessageType.audio);

        // Konfirmasi pengiriman
        m.reply('Pesan audio berhasil dikirim ke saluran.');
    } catch (error) {
        console.error("Error saat mengirim audio:", error);
        m.reply(`Terjadi kesalahan saat mengirim audio.\n${error.message}`);
    }
};

handler.command = /^sendaudio$/i;
handler.owner = true;

module.exports = handler;