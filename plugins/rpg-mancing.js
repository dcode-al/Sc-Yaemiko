let handler = async (m, {
	conn,
	usedPrefix,
	owner
}) => {
        let delay = time => new Promise(res => setTimeout(res, time));
		let lastFishingTime = global.db.data.users[m.sender].lastmancing || 0;
		let timeDiff = Date.now() - lastFishingTime;
		let user = global.db.data.users[m.sender];
		let remainingTime = 180000 - timeDiff; 

		if (user.pancingan > 0) {
		  if (user.umpan > 0) {
			if (timeDiff >= 180000) {
				let iikan = Math.floor(Math.random() * 30);
				await delay(0)
				let fish = await conn.sendMessage(m.chat, {
                text: '```Memancing🎣```',
                contextInfo: {
                externalAdReply: {
                title: 'Memancing🎣',
                body: 'Version: 3.0.1',
                thumbnailUrl: 'https://telegra.ph/file/2a8c8144164d55431edae.jpg',
                mediaType: 1,
                renderLargerThumbnail: true
                }}}, {quoted: m})
                await delay(18000)
                await conn.sendMessage(m.chat, { delete: fish })
                let fish2 = await conn.sendMessage(m.chat, {
                text: '```Umpan Dimakan Oleh Ikan, Anda Sedang Menarik Pancing...```',
                contextInfo: {
                externalAdReply: {
                title: 'Memancing🎣',
                body: 'Version: 3.0.1',
                thumbnailUrl: 'https://telegra.ph/file/98659eff712de8d4fdd0b.jpg',
                mediaType: 1,
                renderLargerThumbnail: true
                }}}, {quoted: m})
                await delay(28000)
                await conn.sendMessage(m.chat, { delete: fish2 })
                user.umpan -= iikan
                user.ikan += iikan
                user.lastmancing = Date.now()
                let kemii = '```Berhasil Mendapatkan:```' + ` ${iikan} Ikan\n\n`
				kemii += '```Sisa Umpan Anda:```' + ` ${user.umpan}\n`
				kemii += '```Total Ikan Anda:```' + ` ${user.ikan}`
                await conn.sendMessage(m.chat, {
                text: kemii,
                contextInfo: {
                externalAdReply: {
                title: 'Memancing🎣',
                body: 'Version: 3.0.1',
                thumbnailUrl: 'https://telegra.ph/file/dfc1cda1e94d0ed45090c.jpg',
                mediaType: 1,
                renderLargerThumbnail: true
                }}}, {quoted: m})
			} else {
				let remainingTimeStr = formatTime(remainingTime);
				conn.reply(m.chat, `Kamu Bisa Memancing Lagi Setelah: *${remainingTimeStr}*`, m);
			}
		  } else {
		   conn.reply(m.chat, 'Kamu Belum Memiliki Umpan, Harap Beli Terlebih Dahulu, Dengan Mengetik *.shop*', m);
           }
		} else {
			conn.reply(m.chat, 'Kamu Belum Memiliki Pancingan, Harap Beli Terlebih Dahulu, Dengan Mengetik *.shop*', m);
		}
}

handler.help = ['mancing'];
handler.tags = ['rpg'];
handler.command = /^(mancing|memancing)$/i;
handler.register = true
handler.rpg = true
handler.group = true

module.exports = handler;

function formatTime(ms) {
	let seconds = Math.floor(ms / 1000);
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);

	seconds %= 60;
	minutes %= 60;
	hours %= 24;

	let hStr = hours.toString().padStart(2, '0');
	let mStr = minutes.toString().padStart(2, '0');
	let sStr = seconds.toString().padStart(2, '0');

	return `${hStr}:${mStr}:${sStr}`;
}