let didyoumean = require('didyoumean')
let similarity = require('similarity')

let handler = m => m

handler.before = function (m, { conn, match, usedPrefix, text, args }) {
	if ((usedPrefix = (match[0] || '')[0])) {
		let noPrefix = m.text.replace(usedPrefix, '').trim()
		let args = noPrefix.trim().split` `.slice(1)
		let alias = Object.values(global.plugins).filter(v => v.help && !v.disabled).map(v => v.help).flat(1)
		if (alias.includes(noPrefix)) return
		let mean = didyoumean(noPrefix, alias)
		let sim = similarity(noPrefix, mean)
		let som = sim * 100
	 if (mean) conn.sendMessage(m.chat, {
      text: `• Halo Kak @${m.sender.split`@`[0]}  Apakah Anda sedang mencari ${usedPrefix + mean} ? 

 ◦ Nama fitur: *${usedPrefix + mean}* 
 ◦ Kempiripan: *${parseInt(som)}%*`,
      contextInfo: {
 isForwarded: true,
 forwardingScore: 99999,
 externalAdReply: {
 showAdAttribution: true,
 title: '✖️ YOUR NOT ACCESS',
 thumbnailUrl: "https://pomf2.lain.la/f/0wp2pr3b.jpg",
 sourceUrl: "",
} forwardedNewsletterMessageInfo: {
                newsletterJid: newsletterId,
                newsletterName: salurannama,
                serverMessageId: -1
            }}}, { quoted: m})
     }
}

module.exports = handler