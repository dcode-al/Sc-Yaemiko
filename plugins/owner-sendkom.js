var crypto = require('crypto');
const proto = require('@whiskeysockets/baileys').proto;
const JOF = idkom;  // Community chat ID
const thumbnailUrl = 'https://pomf2.lain.la/f/z72gu6q.jpg';  // URL of the thumbnail image

let handler = async (m, { conn, text }) => {
  if (conn.user.jid !== global.conn.user.jid) return;

  let chatId = JOF;
  let cc = conn.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : false || m);
  let teks = text ? text : cc.text;
  let footer = '#AlDev';

  const footerText = `\n${' '.repeat(0)}_${footer}_`;

  let broadcastText = /bc|broadcast/i.test(teks) ? teks : teks + footerText;

  const contextInfo = {
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363299719848392@newsletter",
      newsletterName: 'Powered By Yaemiko',
      serverMessageId: -1
    }
  };

  await conn.sendMessage(chatId, { 
    text: broadcastText, 
    contextInfo: contextInfo
  }, { quoted: fverif }).catch(_ => _);

  conn.reply(m.chat, `_Success broadcast to community chat!_`, m);
};

handler.help = ['sendmom', 'sdm'].map(v => v + ' *<teks>*');
handler.tags = ['owner'];
handler.command = /^(sendkom|sdk)$/i;
handler.owner = true;
handler.admin = false;

module.exports = handler;