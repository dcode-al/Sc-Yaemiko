let linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;
let handler = m => m
handler.before = async function (m, {
    isAdmin,
    isBotAdmin
}) {
    if (m.isBaileys || !m.isGroup) return false;

    const chat = global.db.data.chats[m.chat];
    const isGroupLinkKick = linkRegex.exec(m.text);
    const kickMessage = isAdmin ?
        `❌ *Tautan Terdeteksi*\nAnda admin grup tidak bisa dikeluarkan dari grup.` :
        `❌ *Tautan Terdeteksi*\nAnda akan dikeluarkan dari grup.`;

    if (chat.antiLinkkick && isGroupLinkkick) {
        await this.reply(m.chat, kickMessage, null, {
            mentions: [m.sender]
        });
        await this.sendMessage(m.chat, {
            delete: m.key
        });

        if ((!isBotAdmin && isAdmin) || (isBotAdmin && !isAdmin)) {
            await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            await this.reply(m.chat, kickMessage, null, {
                mentions: [m.sender]
            });
            await this.sendMessage(m.chat, {
                delete: m.key
            });
        }
    }
    return true;
}
module.exports = handler