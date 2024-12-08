let handler = async (m, { isPrems, conn, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]

  if (!/^[a-zA-Z\s]+$/.test(text)) {
    m.reply('• *Example :* .setkota Kudus');
    return;
  }

  if (!text || text.length < 3 || text.length > 40) {
    m.reply('*Mohon masukkan nama yang kamu inginkan dengan benar! Maksimal 40 karakter*');
    return;
  }

  // Set nama pengguna
  user.alamat = text.trim()

  await conn.reply(m.chat, `Kota berhasil diubah menjadi *${text.trim()}*.`, m);
};

handler.help = ['setkota']
handler.tags = ['rpg'];
handler.limit = false;
handler.rpg = false;
handler.command = /^setkota|gantikota$/i;

module.exports = handler