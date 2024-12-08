/*
 * CJS
 * @Wm By Indra
 * sumber https://whatsapp.com/channel/0029VaYVlVP9hXF9Ig83hJ3L
 * Don't Delete My Wm
 */

let handler = m => m

handler.before = async function (m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true
  
  let chat = global.db.data.chats[m.chat]
  let sender = global.db.data.chats[m.sender]
  let messageType = m.mtype
  let participant = m.key.participant
  let messageId = m.key.id
  if (chat.antiPoll && messageType === 'pollCreationMessageV3') {
    if (isAdmin || !isBotAdmin) { 
    } else {
      return this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: messageId, participant: participant } })
    }
    return true
  }

  return true
}

module.exports = handler