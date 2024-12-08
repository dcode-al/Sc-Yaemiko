const { G4F } = require("g4f"); 
const g4f = new G4F(); 

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Example: ${usedPrefix}${command} hello`);
  await m.react('🔊');
  
  if (!global.db.data.openai[m.sender]) global.db.data.openai[m.sender] = [];
  if (global.db.data.openai[m.sender].length >= 70) global.db.data.openai[m.sender] = [];

  const systemPrompt = "Kamu adalah Prabowo Subianto presiden 2024 yang baru, kamu orang yang tegas dan cerdas, kamu siap menjawab apapun pertanyaan dan jawab dengan baik, tunjukkan bahwa kamu itu presiden yang cerdas, dan ubah gaya bicaramu seperti Prabowo yang asli";

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
    global.db.data.openai[m.sender].push({
      role: 'user',
      content: text
    });
    global.db.data.openai[m.sender].push({
      role: 'assistant',
      content: json.trim()
    });

    console.log('GPT Response:', json.trim());

    let ttsUrl = `https://ai.xterm.codes/api/text2speech/elevenlabs?text=${encodeURIComponent(json.trim())}&voice=prabowo&key=dcodeindraa`;
    
    console.log('TTS URL:', ttsUrl);

    await conn.sendFile(m.chat, ttsUrl, 'response.mp3', null, m, true);

  } catch (err) {
    console.error('Error:', err);
    await m.reply('Maaf Error Saat Memproses Jawaban.');
  }
  
  await m.react('');
}

handler.help = ['voiceprabowo *<text>*'];
handler.command = /^voiceprabowo|prabowovoice$/i;
handler.tags = ['ai', 'premium'];
handler.premium = true;

module.exports = handler;