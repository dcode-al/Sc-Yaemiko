let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i

let handler = async (m, { conn, text }) => {
let user = global.db.data.users[m.sender]
  conn.sendMessage(m.chat, {
    react: {
      text: 'ðŸ•’',
      key: m.key,
    }
  });
    let [_, code] = text.match(linkRegex) || []
    if (!code) throw 'Link invalid'
    let res = await conn.groupAcceptInvite(code)
    m.reply('Succes')
    let groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce).map(v => v[0])
}
handler.help = ['gabung *<link>*']
handler.tags = ['owner']

handler.command = /^gabung$/i

handler.premium = false
handler.owner = true

module.exports = handler