const fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `• *Example :* ${usedPrefix}${command} https://example.com`, m);
  }

  conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    const response = await fetch(`https://api.pikwy.com/?token=125&url=${text}`);
    if (!response.ok) throw new Error('Failed to capture screenshot.');

    await conn.sendFile(m.chat, response.url, 'screenshot.jpg', `*Screenshot of:* ${text}`, m);
  } catch (e) {
    console.error('Error occurred:', e);
    m.reply(`Error: ${e.message}`);
  }
};

handler.help = ['ssweb2 *<url>*'];
handler.tags = ['tools'];
handler.command = ['ssweb2'];
handler.limit = 2;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

module.exports = handler;