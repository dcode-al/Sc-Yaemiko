/*
* indrog wm
* https://whatsapp.com/channel/0029VaYVlVP9hXF9Ig83hJ3L
* aku janji jika hapus watermark ini maka aku rela miskin hingga 7 turunan"
*/

const axios = require('axios');

let handler = async (m, { conn, args }) => {
  try {
    let text = args.join(' ');
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text;
    if (!text) {
      m.reply("Masukkan kata");
      return;
    }
    await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key } });

    let openAiResponse, ttsResponse;
    try {
      let prompt = `Tolong berikan jawaban dalam bahasa Indonesia untuk teks berikut: ${text}`;
      openAiResponse = await axios.get(`https://skizo.tech/api/openaiv2?apikey=${global.xzn}&text=${encodeURIComponent(prompt)}`);
      let aiText = openAiResponse.data.result;

      // Mengirim permintaan ke TTS API dengan hasil dari OpenAI
      ttsResponse = await axios.get(`https://apisku-furina.vercel.app/api/tts?apikey=indradev&text=${encodeURIComponent(aiText)}&character=goku`);
      
      if (ttsResponse.data.status === 200) {
        let audioUrl = ttsResponse.data.data.oss_url;
        conn.sendFile(m.chat, audioUrl, 'voice_nami.wav', null, m, true);

        await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key } });
      } else {
        throw new Error("Gagal mendapatkan data suara");
      }
    } catch (e) {
      await conn.sendMessage(m.chat, { react: { text: `❌`, key: m.key } });
      m.reply(e + '');
    }
  } catch (error) {
    console.log(error);
    m.reply("Terjadi kesalahan, coba lagi.");
  }
};

handler.help = ['goku <teks>'];
handler.tags = ['ai', 'audio'];
handler.command = /^goku$/i;
handler.limit = true;
handler.premium = false;

module.exports = handler;