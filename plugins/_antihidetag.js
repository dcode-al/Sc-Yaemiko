let handler = m => m

handler.before = async function(m, { conn, text }) {
    let chat = global.db.data.chats[m.chat]
	if(chat.antiHidetag) {
	try {
		let men = m.mentionedJid.length
		let parmen = parseMention(m.text).length
		let member = (await conn.groupMetadata(m.chat)).participants.map(v => v.id).length
		if((parmen < men) && (men >= member)) {
			await m.reply(`Hidetag Terdeteksi!`) 
await conn.sendMessage(m.chat, { delete: m.key }) 
}
		} catch(e) { m.reply(e.message) }
		}
	}
	
module.exports = handler;

function parseMention(text = "") {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
            v => v[1] + "@s.whatsapp.net"
        );
    }