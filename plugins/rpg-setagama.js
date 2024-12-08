let handler = async (m, { isPrems, conn, text, usedPrefix, command }) => {
  const user = global.db.data.users[m.sender]
  if (user.jail === true) {
  let uploadImage = require('../lib/uploadImage')
  let ppUrl = await conn.profilePictureUrl(m.sender, 'image').catch((_) => "https://telegra.ph/file/1dff1788814dd281170f8.jpg")
  let pp = await (await fetch(ppUrl)).buffer()
  let link = await uploadImage(pp)
  let api = `https://api.popcat.xyz/jail?image=${link}`
  let teks = `Hallo, @${m.sender.replace(/@.+/g, '')}!\nKamu masih di dalam penjara jadi kamu tidak bisa menggunakan fitur rpg untuk sementara waktu!`
  conn.sendMessage(m.chat, {
  text: teks,
  contextInfo: {
  mentionedJid: [m.sender],
  externalAdReply: {
  title: 'FurinaV4',
  thumbnailUrl: api,
  mediaType: 1,
  renderLargerThumbnail: true
  }}}, {quoted: m})
  return
  }
  if (!text || !['islam', 'kristen', 'katolik', 'unknown', 'yahudi', 'hindu', 'buddha'].includes(text.toLowerCase())) {
    throw `
Silakan pilih agama yang kamu anut:
- *Islam*  🕌
- *Kristen*  ⛪️
- *Katolik*  📿
- *Yahudi*  🕍
- *Hindu*  🕉️
- *Buddha*  ☸️
- *Unknown* ❓
• *Example :* ${usedPrefix}${command} islam
`.trim()
    return
  }

  // Set agama pengguna
  user.agama = text.toLowerCase()
  
  let agama = `${text}`
  let kapital = capitalizeFirstLetter(agama)
  conn.reply(m.chat, `Agama berhasil diatur sebagai *${kapital}*  ${text.toLowerCase() === 'islam' ? '🕌' : text.toLowerCase() === 'kristen' ? '⛪️' : text.toLowerCase() === 'katolik' ? '📿' : text.toLowerCase() === 'unknown' ? '❓' : text.toLowerCase() === 'yahudi' ? '🕍' : text.toLowerCase() === 'hindu' ? '🕉️' : '☸️'}.`, m)
}
handler.help = ['setagama']
handler.tags = ['rpg', 'life']
handler.rpg = true
handler.register = true
handler.command = /^setagama$/i

module.exports = handler

function capitalizeFirstLetter(str) {
  // Memisahkan string menjadi array kata-kata
  let words = str.split(" ");
  
  // Loop melalui setiap kata
  for (let i = 0; i < words.length; i++) {
    // Ubah huruf pertama dalam setiap kata menjadi besar
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }
  
  // Gabungkan kembali kata-kata menjadi satu string
  return words.join(" ");
}