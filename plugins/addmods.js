let handler = async (m, { conn, text }) => {
    let who;
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text;
    } else {
        who = m.chat;
    }

    if (!who) throw 'Tag orangnya!';

    if (text.match(/-|delete|del/i)) {
        if (!global.mods.includes(who.split`@`[0])) throw 'Dia bukan moderator!';

        global.mods = global.mods.filter(mod => mod !== who.split`@`[0]);
        return conn.reply(m.chat, `@${who.split`@`[0]} sudah tidak menjadi moderator lagi!`, m, {
            contextInfo: {
                mentionedJid: [who]
            }
        });
    }

    if (global.mods.includes(who.split`@`[0])) throw 'Dia sudah menjadi moderator!';

    global.mods.push(`${who.split`@`[0]}`);
    conn.reply(m.chat, `@${who.split`@`[0]} sekarang menjadi moderator!`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    });
}

handler.help = ['addmods [@user]', 'delmods [@user]'];
handler.tags = ['owner'];
handler.command = /^(add|tambah|\+)mods$/i;

handler.owner = true;

module.exports = handler;