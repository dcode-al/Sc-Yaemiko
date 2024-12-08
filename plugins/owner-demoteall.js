let handler = async (m, { conn }) => {
conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) :''
let participants = m.isGroup ? await groupMetadata.participants : ''
let groupAdmins = m.isGroup ? await participants.filter((v) => v.admin !== null).map((i) => i.id) : [] || [];
let data = groupAdmins.splice(m.sender, groupAdmins.length - 1)
await conn.groupParticipantsUpdate(m.chat, data, 'demote')
m.reply('Done')
}
handler.tags = ['owner']
handler.help = ['demoteall']
handler.command = ["demoteall"]
handler.group = true
handler.owner = true
module.exports = handler