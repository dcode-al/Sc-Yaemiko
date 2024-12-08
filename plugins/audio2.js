const fetch = require('node-fetch')
let handler = async (m, { conn, command }) => {
m.reply('SIAP UNTUK DJ OM')
  let audio = `https://raw.githubusercontent.com/aisyah-rest/mangkane/main/Mangkanenya/${command}.mp3`
await conn.sendFile(m.chat, audio, 'error.mp3', null, fkontak, true, {
type: 'audioMessage', 
ptt: false, seconds: 0,contextInfo: {
         externalAdReply: { showAdAttribution: true,
 mediaUrl: '',
    mediaType: 2, 
    description: '',
    title: "Furina sedang memutar ",
    body: `${command}`,
    thumbnail: await (await fetch('https://telegra.ph/file/cbcc938c8eb453c7955ac.jpg')).buffer(),
    sourceUrl: ''
}
     }
    })
}


handler.command = /^(mangkane25|mangkane26|mangkane27|mangkane28|mangkane29|mangkane30|mangkane31|mangkane32|mangkane33|mangkane34|mangkane35|mangkane36|mangkane37|mangkane38|mangkane39|mangkane40|mangkane41|mangkane42|mangkane43|mangkane44|mangkane45|mangkane46|mangkane47|mangkane48|mangkane49|mangkane50|mangkane51|mangkane52|mangkane53|mangkane54)$/i
handler.limit = true
module.exports = handler