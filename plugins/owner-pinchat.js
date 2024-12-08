let handler = async (m, {
    conn,
    command
}) => {
    try {
        const isPin = !command.includes('un');
        
        // Ensure that `m.key` and `m.chat` are present
        if (!conn.chatModify || !m.key || !m.chat) {
            throw new Error('Required parameters are missing.');
        }
        
        // Pin or unpin the message based on the command
        await conn.chatModify({
            pin: isPin
        }, m.chat, m.key);  // `m.key` represents the message ID

        m.reply(`Pesan berhasil di *${isPin ? 'pin' : 'unpin'}*.`);
    } catch (e) {
        console.error('Error in pin/unpin handler:', e);
        m.reply('Gagal, coba lagi nanti.');
    }
}

handler.help = ['pinchat', 'unpin']
handler.tags = ['owner']
handler.command = /^((un)?pinchat)$/i

handler.owner = true

module.exports = handler;