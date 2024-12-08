let handler = async (m, { conn, usedPrefix }) => {
    let id = m.chat
    conn.absen = conn.absen ? conn.absen : {}

    // Check if an absen session exists for the chat
    if (!(id in conn.absen)) {
        return conn.reply(m.chat, `🚩 _*Tidak ada absen berlangsung di grup ini!*_\n\n*${usedPrefix}mulaiabsen* - untuk memulai absen`, m)
    }

    let d = new Date
    let date = d.toLocaleDateString('id', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    let absen = conn.absen[id][1] || []
    
    if (absen.length === 0) {
        return conn.reply(m.chat, `🚩 _*Belum ada yang absen di grup ini!*_\n\n*${usedPrefix}absen* - untuk absen`, m)
    }
    let list = absen.map((v, i) => `│ ${i + 1}. @${v.split`@`[0]}`).join('\n')

    conn.reply(m.chat, `*「 ABSEN 」*

Tanggal: ${date}
${conn.absen[id][2] || ''} 

┌ *List absen:*
│ 
│ Total: ${absen.length}
${list}
│ 
└────

_${global.wm}_`, m, { contextInfo: { mentionedJid: absen } })
}
handler.help = ['cekabsen']
handler.tags = ['absen']
handler.command = /^cekabsen$/i
handler.group = true
module.exports = handler