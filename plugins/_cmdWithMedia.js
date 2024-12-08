let {
    proto,
    generateWAMessage,
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    getAggregateVotesInPollMessage,
    areJidsSameUser
} = require('@whiskeysockets/baileys')

let handler = (m) => m;
handler.before = async (
  m,
  { conn, text, usedPrefix, command, isOwner, chatUpdate },
) => {
  if (m.isBaileys) return;
  if (!m.message) return;
  if (!m.msg.fileSha256) return;
  const stickerHash = await m.msg.fileSha256.toString("base64");
  if (!(stickerHash in global.db.data.sticker)) return;
  const { message } = db.data.sticker[stickerHash];
  await appenTextMessage(m, message, chatUpdate);
  
  async function appenTextMessage (m, text, chatUpdate) {
      let messages = await generateWAMessage(
      m.chat,
      {
        text: text,
        mentions: m.mentionedJid,
      },
      {
        userJid: conn.user.id,
        quoted: m.quoted && m.quoted.fakeObj,
      },
    );
    messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    conn.ev.emit("messages.upsert", msg);
    return m;
  }
};

module.exports = handler;