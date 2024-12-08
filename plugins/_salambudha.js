let handler = async (m, {
    conn,
    command,
    isOwner
}) => {
conn.reply(m.chat, `*Namo buddhisme kak* @${m.sender.replace(/@.+/g, '')}`, m)
}
handler.customPrefix = /^(Namo buddhisme|Namo Buddhaya)$/i
handler.command = new RegExp

module.exports = handler