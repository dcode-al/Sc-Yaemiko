let handler = m => m;

handler.before = async function (m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true;

  let chat = global.db.data.chats[m.chat];
  let isVideo = m.mtype === 'videoMessage';
  let participant = m.key.participant;
  let messageId = m.key.id;

  if (chat.antiVideo && isVideo) {
    if (isAdmin || !isBotAdmin) {
      return true;
    }

    await this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: messageId,
        participant: participant
      }
    });

    return true;
  }

  return true;
};

module.exports = handler;