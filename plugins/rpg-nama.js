let handler = async (m, { isPrems, conn, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]

  if (!/^[a-zA-Z\s]+$/.test(text)) {
    m.reply('• *Example :* .setnama Kemii');
    return;
  }

  if (!text || text.length < 3 || text.length > 40) {
    m.reply('*Mohon masukkan nama yang kamu inginkan dengan benar! Maksimal 40 karakter*');
    return;
  }

  // Set nama pengguna
  user.name = text.trim()

  await conn.reply(m.chat, `Nama berhasil diubah menjadi *${text.trim()}*.`, m);
};

handler.help = ['setnama']
handler.tags = ['rpg', 'life'];
handler.limit = 1000
handler.command = /^setnama|setname$/i;

module.exports = handler