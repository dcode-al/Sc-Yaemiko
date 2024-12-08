let before = async (m, { conn, isOwner, isAdmin }) => {
    if (!m.isGroup) return;

    let ownerGroup = m.chat.split`-`[0] + "@s.whatsapp.net";
    if (isOwner && !isAdmin) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [m.sender], "promote");
            m.reply(`Ada ownerku disini ku jadikan @${m.sender.split('@')[0]} sebagai admin!`);
        } catch (e) {
            console.error(e);
        }
    }
};

module.exports = { before };