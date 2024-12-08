let handler = m => m
handler.before = async function(m) {
    if (!m.isGroup) return;
    if (m.isBaileys) return;
    global.sad = {
          key: { 
          participant: '0@s.whatsapp.net', 
          remoteJid: "0@s.whatsapp.net" }, 
          message: {
          conversation: "Pesan Terakhir"}
          }
    try {
        let body = m.text;
        if (!body.includes("@6289531639634")) return;
        await conn.sendMessage(m.chat, {
text: `Jangan Ngetag Dia Kak, Dia Lagi Galau`,
contextInfo: {
mentionedJid: [m.sender],
externalAdReply: {
showAdAttribution: true,
title: 'Owner Yaemiko',
thumbnailUrl: "https://pomf2.lain.la/f/b1fecmaq.jpg",
sourceUrl: sgc,
mediaType: 1,
renderLargerThumbnail: true
}}}, {quoted: fkontak})
let muskk = {
  audio: { url: 'https://files.catbox.moe/q7mq4q.mp3' }, 
  mimetype: 'audio/mp4',  
  ptt: true,
  viewOnce: false
};
await conn.sendMessage(m.chat, muskk, { quoted: sad });

if (!body.includes("@6283117190494")) return;
await conn.sendMessage(m.chat, {
text: `Ngapain? Ngetag Bang Ziyo`,
contextInfo: {
mentionedJid: [m.sender],
externalAdReply: {
showAdAttribution: true,
title: 'Owner Yaemiko',
thumbnailUrl: 'https://pomf2.lain.la/f/dod4zp6b.jpg',
sourceUrl: sgc,
mediaType: 1,
renderLargerThumbnail: true
}}}, {quoted: fkontak})
let peee = {
  audio: { url: 'https://files.catbox.moe/q7mq4q.mp3' }, 
  mimetype: 'audio/mp4',  
  ptt: true,
  viewOnce: false
};
await conn.sendMessage(m.chat, peee, { quoted: sad });

} catch (e) {
        console.error(e); // Tambahkan logging untuk melihat error jika ada
        await conn.sendMessage(m.chat, 'Terjadi kesalahan saat mengirim pesan atau file audio.', 'conversation', { quoted: m });
    }
}

module.exports = handler;