let handler = async (m, {
    conn,
    command,
    isOwner
}) => {
conn.reply(m.chat, `*om swastyatu kak* @${m.sender.replace(/@.+/g, '')}`, m)
}
handler.customPrefix = /^(om swastyatu|om swastyatu)$/i
handler.command = new RegExp

module.exports = handler