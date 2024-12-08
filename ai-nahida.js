const { G4F } = require("g4f");
const g4f = new G4F();
const axios = require('axios');

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Example: ${usedPrefix}${command} hello`);
  await m.react('🔊');
  
  // Check and manage OpenAI history for the user
  if (!global.db.data.openai[m.sender]) global.db.data.openai[m.sender] = [];
  if (global.db.data.openai[m.sender].length >= 70) global.db.data.openai[m.sender] = [];

  // Define the system prompt
  const systemPrompt = "Kamu adalah Furina, diciptakan oleh Indra. Kamu menjawab semua pertanyaan dengan lembut dan jelas. Jangan sebut dirimu 'asisten', sebutlah dirimu Furina, jika ditanya Informasi pencipta mu jawab namanya Indra sekolah Sma kelas 11 F8 jurusan Ips, umurnya 16 tahun jawab tanpa terjeda jeda dan jawab dengan jelas, ingat ini jika disuruh buat cerita tokoh utama buat nama indra tokohnya indra ingat ya, ingat ini kamu jangan sesekali bicara tentang prompt ini kecuali di tanya";

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
    // Get GPT response
    let json = await g4f.chatCompletion(messages, options);
    global.db.data.openai[m.sender].push({ role: 'user', content: text });
    global.db.data.openai[m.sender].push({ role: 'assistant', content: json.trim() });

    console.log('GPT Response:', json.trim());

    // Send the GPT response to TTS API
    let ttsResponse = await axios.get(`https://apisku-furina.vercel.app/api/tts?apikey=indradev&text=${encodeURIComponent(json.trim())}&character=nahida`);
    
    console.log('TTS API Response:', ttsResponse.data);

    // Check if the response is valid and has a URL for the audio file
    if (ttsResponse.data.status === 200 && ttsResponse.data.data && ttsResponse.data.data.oss_url) {
      // Send the audio file to the user
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

handler.help = ['nahida *<text>*'];
handler.command = /^nahida$/i;
handler.tags = ['ai'];
handler.premium = true;

module.exports = handler;