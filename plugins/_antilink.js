/* @By Indra
  * 17 Agustus 2024 ( 19.20 )
  * https://whatsapp.com/channel/0029VaYVlVP9hXF9Ig83hJ3L
  * Dont Delete My Wm
*/

let linkRegex = /(saweria.co|saweria.com|chat.whatsapp.com\/([0-9A-Za-z]{20,24})|(https?:\/\/)?(www\.)?([a-zA-Z0-9\-]+\.)+(vercel.app|com|xyz|me|my|id|io|eu\.org|biz|biz\.id)(\/[^\s]+)?)/i;

async function before(m, { isBotAdmin, isAdmin }) {
  if (
    (m.isBaileys && m.fromMe) || 
    m.fromMe || 
    !m.isGroup
  ) return true;

  let chat = global.db.data.chats[m.chat];
  let msg = m.message;
  let bodyText = m.text || 
                 (msg.pollCreationMessageV3 && msg.pollCreationMessageV3.name) || 
                 (msg.editedMessage && msg.editedMessage.message && msg.editedMessage.message.protocolMessage && msg.editedMessage.message.protocolMessage.editedMessage && msg.editedMessage.message.protocolMessage.editedMessage.conversation) || 
                 (msg.editedMessage && msg.editedMessage.message.protocolMessage.editedTextMessage && msg.editedMessage.message.protocolMessage.editedTextMessage.extendedTextMessage.text) || 
                 "";

  let isGroupLink = linkRegex.exec(bodyText);

  let hapus = m.key.participant;
  let bang = m.key.id;

  if (msg.document) {
    let docCaption = msg.document.caption || "";
    isGroupLink = isGroupLink || linkRegex.exec(docCaption);
  }

  if (msg.eventMessage) {
    let eventName = msg.eventMessage.name || "";
    let eventDescription = msg.eventMessage.description || "";
    let locationName = msg.eventMessage.location ? msg.eventMessage.location.name || "" : "";
    isGroupLink = isGroupLink || linkRegex.exec(eventName) || linkRegex.exec(eventDescription) || linkRegex.exec(locationName);
  }

  if (msg.imageMessage) {
    let imageCaption = msg.imageMessage.caption || "";
    isGroupLink = isGroupLink || linkRegex.exec(imageCaption);
  }

  if (msg.locationMessage) {
    let locationCaption = msg.locationMessage.caption || "";
    isGroupLink = isGroupLink || linkRegex.exec(locationCaption);
  }

  if (chat.antiLink && isGroupLink) {
    if (isAdmin) return true;
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: hapus }});
  }
  return true;
}

module.exports = { before };