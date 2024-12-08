let handler = async (m, {
    conn,
    command,
    isOwner,
    isPrems,
    isMods   
}) => {
    let text;
    let fdoc = { key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net' }, message: { documentMessage: { title: 'Y A E M I K O - MD' } } };
    if (isOwner) {
        text = `Apa sayangku, cintaku, hidupku yang paling ganteng😙 @${m.sender.split('@')[0]}`;
    } else if (isPrems) {
        text = `Napa ngab manggil aku`;
    } else if (isMods) {
        text = `Apaan bang?`;
    } else {
        text = `Halo Kak @${m.sender.split('@')[0]},\nada yang bisa saya bantu?`;
    } 
    try {
conn.sendMessage(m.chat, {
text: text,
contextInfo: {
mentionedJid: [m.sender],
externalAdReply: {
showAdAttribution: true,
title: '𝗬𝗮𝗲𝗺𝗶𝗸𝗼-𝗠𝗗',
thumbnailUrl: 'https://pomf2.lain.la/f/2sa44t2y.jpg',
sourceUrl: 'https://chat.whatsapp.com/BASFqgR4PJDIKq1hwGcCzJ',
mediaType: 1,
renderLargerThumbnail: true
}}}, {quoted: m})
let muskk = {
  audio: { url: 'https://files.catbox.moe/q7mq4q.mp3' }, 
  mimetype: 'audio/mp4',  
  ptt: true,
  viewOnce: false
};
await conn.sendMessage(m.chat, muskk, { quoted: fdoc });
} catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, 'Terjadi kesalahan saat mengirim pesan atau file audio.', 'conversation', { quoted: m });
    } }
handler.customPrefix = /^(bot|sayang|ayang|miko|yaemiko)$/i
handler.command = new RegExp

module.exports = handler