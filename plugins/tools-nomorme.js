let handler = async (m, { conn, text, command, participants, isOwner, Func }) => {
    let number = m.quoted ? m.quoted.sender.split('@')[0] : m.sender.split('@')[0];
    let chat = text ? text : 'woi';
    await conn.reply(m.chat, `${number}`, m);
};

handler.command = /^nome$/i;
handler.tags = ["tools"];
handler.help = ["nome"];

module.exports = handler;