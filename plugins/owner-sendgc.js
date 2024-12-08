/* 
 *@Wm By Indra
 * https://whatsapp.com/channel/0029VaYVlVP9hXF9Ig83hJ3L
 * Dont delete My Wm
*/

let moment = require('moment-timezone');

let handler = async (m, { conn, isOwner, isROwner, text }) => {
    if (conn.user.jid !== global.conn.user.jid) return;

    // Pastikan untuk mengganti dengan ID grup yang dituju
    const groupId = '120363309061346090@g.us'; // Ganti dengan ID grup yang diinginkan

    const fcon = {
        key: {
            participant: `0@s.whatsapp.net`,
            ...(m.chat ? { remoteJid: `status@broadcast` } : {})
        },
        message: {
            'contactMessage': {
                'displayName': `© Yaemiko By AlDev`,
            }
        }
    };

    let pesan = text;
    if (!pesan) throw '• *Contoh :* .sendgc Hello';

    await conn.reply(groupId, `${pesan}`, fcon, {
        contextInfo: {
   isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363299719848392@newsletter",
      newsletterName: 'Powered By Yaemiko',
      serverMessageId: -1
            }
        }
    });

    m.reply(`Berhasil Mengirim Pesan ke Grup ${groupId}`);
};

handler.help = ['sendgc *<text>*'];
handler.tags = ['owner'];
handler.command = /^(sendgc)$/i;
handler.owner = true;

module.exports = handler;