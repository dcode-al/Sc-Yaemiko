let handler = async (m, {
    conn,
    command
}) => {
    let user = global.db.data.users[m.sender];
    let imgr = 'https://telegra.ph/file/73f53c6d5e3d039902a3c.jpg';
    const caption = `
- 📜 *H U T A N G  U S E R* 
• 📝 *Name:* ${user.registered ? user.name : conn.getName(m.sender)}
• 💰 *Money:* ${user.money} 💵
`.trim();

    await conn.sendFile(m.chat, imgr, "", caption, m);
};
handler.help = ['hutang'];
handler.tags = ['rpg'];
handler.command = /^(hutang)$/i;

handler.register = false;
module.exports = handler;