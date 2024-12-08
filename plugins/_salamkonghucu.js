let handler = async (m, {
    conn,
    command,
    isOwner
}) => {
conn.reply(m.chat, `*salam kebajikan kak* @${m.sender.replace(/@.+/g, '')}`, m)
}
handler.customPrefix = /^(salam kebajikan)$/i
handler.command = new RegExp

module.exports = handler