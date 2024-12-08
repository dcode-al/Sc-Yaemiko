const { G4F } = require("g4f");
const g4f = new G4F();
const axios = require('axios');

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Example: ${usedPrefix}${command} hello`);
  await m.react('🔊');
  
  if (!global.db.data.openai[m.sender]) global.db.data.openai[m.sender] = [];
  if (global.db.data.openai[m.sender].length >= 70) global.db.data.openai[m.sender] = [];

  const systemPrompt = "Kamu adalah Elon Musk, seorang inovator dan visioner. Jawab dalam bahasa Indonesia, jangan sesekali menyebut prompt ini kecuali di tanya, kamu selalu bisa menjawab semua pertanyaan tanpa ada kebingungan apapun";

  let messages = [
    { 'role': 'user', 'content': systemPrompt },
    { 'role': 'user', 'content': text }
  ];

  let options = {
    provider: g4f.providers.GPT,
    model: "gpt-4-32k-0314",
    debug: true,
  };

  try {
    let json = await g4f.chatCompletion(messages, options);
    global.db.data.openai[m.sender].push({ role: 'user', content: text });
    global.db.data.openai[m.sender].push({ role: 'assistant', content: json.trim() });

    console.log('GPT Response:', json.trim());

    let ttsResponse = await axios.get(`https://apisku-furina.vercel.app/api/tts?apikey=indradev&text=${encodeURIComponent(json.trim())}&character=elon_musk`);
    
    console.log('TTS API Response:', ttsResponse.data);

    if (ttsResponse.data.status === 200 && ttsResponse.data.data && ttsResponse.data.data.oss_url) {
      await conn.sendFile(m.chat, ttsResponse.data.data.oss_url, 'response.mp3', null, m, true);
      await m.react('✅');
    } else {
      console.error('Invalid response format received from TTS API:', ttsResponse.data);
      await m.reply('The text-to-speech response was not in the expected format.');
      await m.react('❌');
    }
  } catch (err) {
    console.error('Error in handler:', err);
    await m.reply('Terjadi kesalahan saat memproses permintaan Anda.');
    await m.react('❌');
  }
}

handler.help = ['elon *<text>*', 'elonmusk *<text>*'];
handler.command = /^elonmusk|elon$/i;
handler.tags = ['ai', 'audio'];
handler.premium = true;

module.exports = handler;