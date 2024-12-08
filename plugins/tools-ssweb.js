const screenshot = (new(require('../lib/ssweb')));

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `• *Example :* ${usedPrefix}${command} https://example.com`, m);
  }

  conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    const result = await screenshot.screenshot(text); 
    if (!result.status) throw new Error('Gagal mengambil screenshot.');

    const { gambar, device, date, ourl } = result.data; 
    const caption = `*${ourl}*`;
 
    await conn.sendFile(m.chat, gambar, 'screenshot.jpg', caption, m);
  } catch (e) {
    console.error('Error occurred:', e);
    m.reply(`Error: ${e.message}`);
  }
};

handler.help = ['ssweb *<url>*', 'sspc *<url>*'];
handler.tags = ['tools'];
handler.command = ['ssweb', 'sspc']; 
handler.limit = 2;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

module.exports = handler;