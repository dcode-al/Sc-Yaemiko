let handler = async (m, { conn, text, command, participants, isOwner, Func }) => {
    let number = m.quoted ? m.quoted.sender.split('@')[0] : m.sender.split('@')[0];
    let chat = text ? text : 'woi';
    await conn.reply(m.chat, `https://wa.me/${number}?text=${encodeURI(chat)}`, m);
};

handler.command = /^wame$/i;
handler.tags = ["tools"];
handler.help = ["wame"];

module.exports = handler;