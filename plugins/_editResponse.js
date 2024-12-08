const {
    proto,
    generateWAMessage,
    areJidsSameUser
} = require('@whiskeysockets/baileys')

async function before(m, chatUpdate) {
    if (m.isBaileys) return;
    if (!m.message) return;
    if (!m.message?.editedMessage) return;
    let hash = {
        text: m.message?.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || m.message?.editedMessage?.extendedTextMessage?.text || null,
        mentionedJid: [m.sender] || []
    };
    let {
        text,
        mentionedJid
    } = hash
    if (!text && !mentionedJid) return;
    let messages = await generateWAMessage(m.chat, {
        text: text,
        mentions: mentionedJid
    }, {
        userJid: this.user.id,
        quoted: m.quoted && m.quoted?.fakeObj
    })
    messages.key.fromMe = areJidsSameUser(m.sender, this.user.jid || this.user.id)
    messages.key.id = m.key.id
    messages.pushName = m.pushName || m.name
    if (m.isGroup) messages.participant = m.sender
    let msg = {
        ...chatUpdate,
        messages: [proto.WebMessageInfo.fromObject(messages)],
        type: 'append'
    }
    this.ev.emit('messages.upsert', msg)
}

module.exports = {
    before,
}