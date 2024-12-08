let handler = async (m, {
    conn,
    command,
    isOwner
}) => {
conn.reply(m.chat, `*Syalom kak* @${m.sender.replace(/@.+/g, '')}`, m)
}
handler.customPrefix = /^(syalom|shalom)$/i
handler.command = new RegExp

module.exports = handler