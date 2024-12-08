async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return;

    if (m.fromMe) return true;

    if (m.id.startsWith('3EB0') && m.id.length === 22) {
        let chat = global.db.data.chats[m.chat];

        if (chat.antiBot) {
            await conn.reply(m.chat, "*Bot Lain Terdeteksi* :)", null);
            await conn.delay(1000);

            if (!isAdmin && isBotAdmin) {
                await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
            }
        }
    }
}

module.exports = { before };