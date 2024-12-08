const path = require("path");
const fs = require("fs");

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (conn.user.jid !== global.conn.user.jid) return;

  const filePath = path.join(__dirname, "../database.json");

  if (!fs.existsSync(filePath)) {
    return m.reply('File tidak ditemukan');
  }

  try {
    fs.unlinkSync(filePath);
    conn.reply(m.chat, `🚩 Sukses Delete database`, m);
  } catch (err) {
    console.error(err);
    conn.reply(m.chat, `Terjadi kesalahan saat menghapus: ${err.message}`, m);
  }
}

handler.help = ['deldatabase', 'deldb'];
handler.command = /^deldb|deldb$/i;
handler.tags = ['owner'];
handler.owner = true;

module.exports = handler;