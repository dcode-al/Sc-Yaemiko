let handler = async (m, {
    conn,
    command,
    isOwner
}) => {
conn.reply(m.chat, `*Apa Kontoll* @${m.sender.replace(/@.+/g, '')}`,fverif )
}
handler.customPrefix = /^(kontol)$/i
handler.command = new RegExp

module.exports = handler