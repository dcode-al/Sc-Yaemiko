const { relayMessage } = require('@whiskeysockets/baileys');

async function handleStatusUpdate(m, conn) {
  if (m.key.remoteJid === 'status@broadcast') {
    try {
      // Kirim reaksi ke status baru
      await conn.relayMessage(
        m.key.remoteJid,
        {
          reactionMessage: {
            key: {
              remoteJid: 'status@broadcast',
              id: m.key.id,
              participant: m.key.remoteJid,
              fromMe: false
            },
            text: '💚' // Emoji reaksi
          }
        },
        {
          messageId: m.key.id,
          statusJidList: [m.key.remoteJid, m.key.participant]
        }
      );
    } catch (error) {
      console.error('Error reacting to status:', error);
    }
  }
}

function setupEventHandlers(conn) {
  conn.ev.on('messages.upsert', (chatUpdate) => {
    const message = chatUpdate.messages[0];
    if (message) {
      handleStatusUpdate(message, conn);
    }
  });
}

module.exports = {
  setupEventHandlers
};