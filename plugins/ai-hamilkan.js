const axios = require ('axios')
const uploadImage = require ('../lib/uploadImage.js')
const fetch = require ('node-fetch')

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	if (/image\/(jpe?g|png)/.test(mime) && !/webp/.test(mime)) {
		let prompt = '', teks = (args[0] || '').toLowerCase().trim()
		let img = await q.download()
		let out = await uploadImage(img)
		try {
		conn.sendMessage(m.chat, {
		react: {
			text: '👍',
			key: m.key,
		}
	})
			let y = 0
			if (/jadi/.test(command) || command.startsWith('to')) {
				teks = command.replace(/jadi|to/,'')
				prompt = args.join(' ')
			} else {
				teks = text.split('|')[0];
			}
			let anu = await (await fetch(`https://api.itsrose.rest/image/turnMe`, {
				method: 'POST',
				headers: {
				    Authorization: global.rose,
					'accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					init_image: out,
					style: teks,
					skin: 'chindo',
					image_num: 2,
					prompt: "muslimah, carrying a child, pregnant, perfect body, high quality, big breasts",
				})
			})).json()
			if (!anu.status) return m.reply(anu.styles ? `[ ! ] *example:* *${usedPrefix+command} zombie*\n\n▧「 *available styles* 」\n│✦ ${anu.styles.join('\n│✦ ')}\n└──···` : anu.message)
			for (let x of anu.result.images) {
				await conn.sendFile(m.chat, x, '', `${y < 1 ? `*STYLE: ${teks}*` : `${teks} style (${y+1})`}${prompt ? `\nprompt : ${prompt}` : ''}`, m)
				y++;
			}
		} catch (e) {
			console.log(e)
			throw e.response?.data?.message || 'Internal server error.'
		}
	} else throw `[ ! ] send/reply image with caption ${usedPrefix + command}`
}

handler.help = ['hamilkan']
handler.tags = ['ai']
handler.command = /^(hamilkan)$/i

handler.premium = true
handler.limit = false

module.exports = handler