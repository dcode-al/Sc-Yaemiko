let handler = async (m, { conn, text }) => {
    let who
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text
    } else {
        who = m.chat
    }

    if (!who) throw 'Tag yang ingin di unban atau reply pesan mereka!'

    let users = global.db.data.users
    if (!users[who]) throw 'Pengguna tidak ditemukan dalam database!'

    users[who].banned = false
    conn.sendMessage(m.chat, { react: { text: '☑️', key: m.key }})
    conn.reply(m.chat, `@${who.split`@`[0]} telah di-unban!`, m, {
        contextInfo: {
            mentionedJid: [who]
        }
    })
}

handler.help = ['unban']
handler.tags = ['owner', 'mods']
handler.command = /^unban$/i
handler.mods = true

module.exports = handler