let handler = async (m, { conn, usedPrefix, command, args }) => {
    let req = await conn.groupRequestParticipantsList(m.chat)
    if (req.length == 0) return m.reply('Saat ini tidak ada permintaan masuk!')
    if (!args[0]) return m.reply(`
List Permintaan Masuk Group :

${req.map((v, i) => {
    return `
${i + 1}. ${conn.getName(v.jid)}
`.trim()
}).join('\n')}

Cara Penggunaan:
${usedPrefix + command} 1
`)
    if (!isNaN(args[0]) && typeof args[0] == 'number') return m.reply('Hanya angka!')
    if (args[0] > req.length) return m.reply('Angka tidak valid')
    if (/all|semua/i.test(args[0])) {
        for (let v of req) {
            await conn.groupRequestParticipantsUpdate(m.chat, [v], "approve")
            await delay(5000)
        }
        m.reply(`Berhasil menerima ${req.length} permintaan masuk`)
    } else {
        await conn.groupRequestParticipantsUpdate(m.chat, [req[args[0] - 1].jid], "approve")
        m.reply(`Berhasil menerima permintaan masuk dari @${req[args[0] - 1].jid.split('@')[0]}`, false, { mentions: [req[args[0] - 1].jid] })
    }
}
handler.help = ['approve']
handler.tags = ['group']
handler.command = /(approve)$/i
handler.group = true
handler.botAdmin = true
handler.admin = true
module.exports = handler

const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))