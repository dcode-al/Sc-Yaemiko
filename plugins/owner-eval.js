/*** @Wm By Indra
   * Dont delete My Wm
   * https://whatsapp.com/channel/0029VaYVlVP9hXF9Ig83hJ3L
***/

const handler = async (m, { conn, text }) => {
  if (!text) {
    await conn.reply(m.chat, 'Contoh penggunaan: !eval 2 + 2', m);
    return;
  }

  let output = '';
  const originalConsoleLog = console.log;

  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };

  try {
    // Execute eval
    const result = eval(text);
    if (typeof result !== 'undefined') {
      output += `Result: ${result}`;
    }
  } catch (e) {
    output += `Error: ${e.toString()}`;
  }

  console.log = originalConsoleLog;

  // Send response
  await conn.reply(m.chat, output.trim(), m);
};

handler.command = /^(eval|js)$/i;
handler.tags = ['owner'];
handler.help = ['eval', 'js'];
handler.owner = true;

module.exports = handler;