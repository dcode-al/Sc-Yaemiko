// CJS
// By Indra Ganteng
// https://whatsapp.com/channel/0029VaYVlVP9hXF9Ig83hJ3L
// Juli 7 2024
// No delete My Wm

let handler = async (m, { conn, text }) => {
    let user = global.db.data.users[m.sender]
    
    if (!text && !m.quoted) return conn.reply(m.chat, '• *Contoh :* .ban +628816609112 atau balas pesan target dengan .ban', m)

    let who = m.isGroup ? (m.mentionedJid[0] || m.quoted.sender) : m.chat
    
    if (!who) return conn.reply(m.chat, '🚩 Silakan tag atau balas pesan orang yang ingin diban.', m)

    let users = global.db.data.users

    // Memeriksa apakah pengguna yang akan diban adalah salah satu nomor yang dilindungi
    const protectedNumbers = ['085325268412', '6285325268412']
    const formattedNumber = who.replace(/[^0-9]/g, '') // Menghapus karakter non-numerik

    if (protectedNumbers.includes(formattedNumber)) {
        return conn.reply(m.chat, '🚩 Nomor ini tidak bisa diban.', m)
    }

    users[who].banned = true
    conn.sendMessage(m.chat, { react: { text: '☑️', key: m.key }})

    if (users[who].vip == true) {
        user.vip = true
        users[who].banned = false
        conn.sendMessage(m.chat, { react: { text: '❌', key: m.key }})
        return conn.reply(m.chat, '🚩 Tidak bisa ban pengguna ini karena dia adalah anggota VIP.', m)
    }
}

handler.help = ['ban']
handler.tags = ['owner', 'mods']
handler.command = /^ban$/i
handler.mods = true

module.exports = handler