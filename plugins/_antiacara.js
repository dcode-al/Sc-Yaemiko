let handler = m => m

handler.before = async function (m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true
  
  let chat = global.db.data.chats[m.chat]
  let messageType = m.mtype
  let participant = m.key.participant
  let messageId = m.key.id

  if (chat.antiEvent && messageType === 'eventMessage') {
    if (isAdmin || !isBotAdmin) {
    } else {
      return this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: messageId, participant: participant } })
    }
    return true
  }

  return true
}

module.exports = handler