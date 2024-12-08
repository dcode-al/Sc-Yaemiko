let { Client } = require('ssh2');
let sqlite3 = require('sqlite3');

let db = new sqlite3.Database('VpsInfo.db');

let handler = async (m, { conn, text, args }) => {
conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
try {
db.run('DELETE FROM VpsInfo');
return conn.reply(m.chat, 'Data VPS berhasil dihapus dari database.', m);
} catch (e) {
console.error(e);
return m.reply('Terjadi kesalahan dalam menjalankan permintaan Anda.')
}
}
handler.tags = ['ssh']
handler.command = handler.help = ['sshclose']
handler.owner = true
module.exports = handler