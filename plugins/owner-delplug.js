const path = require("path");
const fs = require("fs");

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (conn.user.jid !== global.conn.user.jid) return;

  if (!text) {
    return conn.reply(m.chat, `• *Example :* ${usedPrefix + command} filename`, m);
  }

  const filePath = path.join(__dirname, "../plugins", `${text}.js`);

  if (!fs.existsSync(filePath)) {
    return m.reply('File tidak ditemukan');
  }

  try {
    fs.unlinkSync(filePath);
    conn.reply(m.chat, `🚩 Sukses Delete ${text}.js!`, m);
  } catch (err) {
    console.error(err);
    conn.reply(m.chat, `Terjadi kesalahan saat menghapus: ${err.message}`, m);
  }
}

handler.help = ['delplug *<filename>*', 'dp *<filename>*'];
handler.command = /^dp|delplug$/i;
handler.tags = ['owner'];
handler.owner = true;

module.exports = handler;