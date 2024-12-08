let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    conn.listAfk = conn.listAfk || {};
    try {
        let user = global.db.data.users[m.sender]
        user.afk = +new Date();
        user.afkReason = text;
        const username = m.name || m.pushName;
        const id = m.sender || m.key.remoteJid;

        conn.listAfk[m.chat] = conn.listAfk[m.chat] ?
            conn.listAfk[m.chat].some(user => user.id === id) ?
            conn.listAfk[m.chat] : [...conn.listAfk[m.chat], {
                username,
                id
            }] : [{
                username,
                id
            }];

        conn.reply(m.chat, `◦ 🔖 *Nama* : ${username}\n◦ 👤 *User* :  @${m.sender.split("@")[0]}\n◦ 📃 *Status* : afk\n◦ 📝 *Alasan* ${text ? ': ' + text : ''}`, m)
    } catch (error) {
        console.error(error);
    }
}

handler.help = ['afk *<reason>*']
handler.tags = ['group']
handler.command = /^afk$/i
handler.group = true

module.exports = handler