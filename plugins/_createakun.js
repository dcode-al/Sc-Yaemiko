let handler = async (m, {
    conn,
    command,
    isOwner
}) => {
conn.reply(m.chat, `*Mungkin yang anda maksud adalah*\n\n> Createakuntt untuk membuat akun tiktok\n> Createakunyt untuk membuat akun youtube`,fverif )
}
handler.customPrefix = /^(createakun)$/i
handler.command = new RegExp

module.exports = handler