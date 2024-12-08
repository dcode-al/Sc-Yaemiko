var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Contoh: ${usedPrefix + command} pertanyaan lu`;

    const { key } = await conn.sendMessage(
        m.chat,
        { text: "Tunggu sebentar..." },
        { quoted: m }
    );

    // Memastikan `text` terdefinisi dan memiliki format yang benar
    let pertanyaan = text.trim();

    if (!pertanyaan) throw `Format salah. Contoh: ${usedPrefix + command} pertanyaan lu`;

    pertanyaan = encodeURIComponent(pertanyaan);

    var apii = await fetch(`https://skizo.tech/api/openai?apikey=${global.xzn}&text=${pertanyaan}&system=kamu adalah furina jawab pakai bahasa jawa kamu di ciptakan oleh Indra @6285325268412 ingat jawab semua pertanyaan dengan bahasa jawa ingat itu dan wajib ingat`);
    var res = await apii.json();

    await conn.sendMessage(
        m.chat,
        { text: "*[ Openai Jawa ]* " + "\n" + res.result, edit: key },
        { quoted: m }
    );
};

handler.help = ["aijawa *<text>*", "aijw *<text>*"];
handler.tags = ['ai'];
handler.command = /^(aijawa|aijw)$/i;

module.exports = handler;