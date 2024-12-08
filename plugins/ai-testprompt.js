/*
don't delete wm!, please follow the channel
https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
*/

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Contoh: ${usedPrefix + command} prompt lu|pertanyaan lu`;
    
    const { key } = await conn.sendMessage(
        m.chat,
        { text: "Tunggu sebentar..." },
        { quoted: m }
    );

    // Memastikan `text` terdefinisi dan memiliki format yang benar
    let q = text.trim();
    let [prompt, pertanyaan] = q.split("|");

    if (!prompt || !pertanyaan) throw `Format salah. Contoh: ${usedPrefix + command} prompt lu|pertanyaan lu`;

    prompt = encodeURIComponent(prompt.trim());
    pertanyaan = encodeURIComponent(pertanyaan.trim());

    var apii = await fetch(`https://skizo.tech/api/openai?apikey=${global.xzn}&text=${pertanyaan}&system=${prompt}`);
    var res = await apii.json();

    await conn.sendMessage(
        m.chat,
        { text: "*[ GPT-PROMPT ]* " + "\n" + res.result, edit: key },
        { quoted: m }
    );
};

handler.help = ["tesprompt *<text>*"];
handler.tags = ['ai'];
handler.command = /^(gpt-prompt|tesprompt)$/i;

module.exports = handler;