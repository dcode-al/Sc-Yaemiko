async function handler(m, { isPrems, conn, text, usedPrefix, command }) {
  const userData = global.db.data.users[m.sender];

  if (!userData) {
    throw 'Data pengguna tidak ditemukan';
  }

  if (userData.verified == true) {
    throw `*Kamu sudah terverifikasi, tidak bisa ganti gender*\nHubungi wa.me/${global.nomorown} untuk mengganti`;
  }

  if (userData.gender !== "-" && isPrems == false && userData.gamepass < 1) {
    throw '*Gender pengguna hanya bisa diatur satu kali saja.*\n⁉️ atau gunakan gamepass';
  }

  if (!text || !['pria', 'wanita'].includes(text.toLowerCase())) {
    throw `
Silahkan Pilih *${command} :*
- ♂️ *Pria*
- ♀️ *Wanita*
Contoh: *${usedPrefix}${command} Pria*
`.trim();
  }

  // Set kelamin pengguna
  userData.gender = text.toLowerCase();

  let gender = text.toLowerCase();
  let kapital = capitalizeFirstLetter(gender);
  conn.reply(m.chat, `Gender berhasil diatur sebagai *${kapital}* ${gender === 'pria' ? '' : gender === 'wanita' ? '' : '☸️'}.`, m);

  if (userData.gamepass >= 1 && isPrems == false && userData.gender != '-') {
    userData.gamepass -= 1;
    m.reply('*-1 ⁉️ gamepass*');
  }
}

handler.help = ['setgender'];
handler.tags = ['rpg', 'life'];
handler.command = /^(setgender|setkelamin)$/i;
handler.rpg = true 
module.exports = handler;

function capitalizeFirstLetter(str) {
  let words = str.split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }

  return words.join(" ");
}