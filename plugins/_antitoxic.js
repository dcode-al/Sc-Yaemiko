const isToxic = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|babi|anj|bangsad|bgsd|peler|pantek|ngentod|kontol|ngentd|ngntod|koncol|kncl|kncol|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole|a(su|sw|syu)/i // tambahin sendiri

export async function before(m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe)
        return !0
    if (!m.isGroup) return !1
    let chat = global.db.data.chats[m.chat]
    let name = conn.getName(m.sender)
    let bot = global.db.data.settings[this.user.jid] || {}
    const isAntiToxic = isToxic.exec(m.text)
    let hapus = m.key.participant
    let bang = m.key.id
    let audio = {
        audio: {url: 'https://files.catbox.moe/wpd60p.mp3'},
        mimetype: 'audio/mp4',
        ptt: true,
         contextInfo: {
           externalAdReply: {
           showAdAttribution: true,
           mediaType: 1,
           mediaUrl: '',
           title: 'Yaemiko-MD',
           body: 'Jangan Toxic Om',
           sourceUrl: '',
           thumbnail: await (await conn.getFile('https://pomf2.lain.la/f/r0jss7vl.jpg')).data,
           renderLargerThumbnail: true
      }
    }
  };

    if (chat.antiToxic && isAntiToxic) {
      conn.sendMessage(m.chat, audio, { quoted: m })
    if (isBotAdmin && chat.antiToxic) {
            await conn.sendMessage(m.chat, { delete: m.key })
            return !1
        } else if (!chat.antiToxic) {
             await conn.sendMessage(m.chat, { delete: m.key })
            await conn.sendMessage(m.chat, audio, { quoted: m })
            return !1
        }
    }
    return !0
}

export const disable = true