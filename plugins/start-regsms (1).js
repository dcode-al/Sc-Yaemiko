let fetch = require('node-fetch')
let handler = async function (m, { conn, args, usedPrefix, command }) {
      let users = global.db.data.users[m.sender]
      let name = await conn.getName(m.sender)
      if (users.registered === true) return conn.reply(m.chat, '```✅ Nomor Kamu Udah Terverifikasi```', m)
      if (!args || !args[0]) return conn.reply(m.chat, `• *Example :* .${command} 6288980870067`, m)
      await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
      let code = `${getRandomInt(100, 900)}-${getRandomInt(100, 900)}`
      let kemii = conn.user.jid.split("@")[0]
      users.codeExpire = new Date * 1
      users.code = code
      users.nomer = args[0]
        await fetch("https://2vgq8p.api.infobip.com/sms/2/text/advanced", {
                method: "POST",
                headers: {
                    "Authorization": "App 3e883011e308183c6645b3b8016d6884-516248f0-d23d-48e0-9344-c75b96fa3102",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                "messages": [
                {
                "destinations": [{"to":`${args[0]}`}],
                "from": "ServiceSMS",
                "text": `Hello ${name}!\nThis Your Verification Code : ${code}`
                 }
                 ]                
                 }),
                 redirect: "follow"
             })
            .then(response => response.text())
         return conn.reply(m.sender, '```✅ Kode Sudah Terkirim \nCek Sms Untuk Melanjutkan Verifikasi!```', m)
}
handler.help = ['regsms *<number>*']
handler.tags = ['start']

handler.command = /^(regsms)$/i
handler.private = false

module.exports = handler

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}