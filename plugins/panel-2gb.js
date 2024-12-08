let fetch = require('node-fetch');
let moment = require('moment-timezone');

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
if (!args[0] || !args[1]) throw `• *Example :* ${usedPrefix}${command} Kemii 6288980870067`
try {
let randomSevenDigitNumber = String(Math.floor(1000000 + Math.random() * 9000000));
let response = await fetch(global.domain + "/api/application/users", {
method: "POST",
headers: {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + global.apikey
},
body: JSON.stringify({
"email": args[0] + "@dcodekemii.shop",
"username": args[0],
"first_name": args[0],
"last_name": args[0],
"language": "en",
"password": randomSevenDigitNumber
})
});

let userData = await response.json()

if (response.ok) {
let user = await userData.attributes;

let f1 = await fetch(global.domain + "/api/application/nests/5/eggs/" + global.eggs, {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + global.apikey
}
});

if (!f1.ok) return conn.reply(m.chat, 'Terjadi kesalahan saat mengambil data egg.', m);
let data = await f1.json();
let startup_cmd = data.attributes.startup

await fetch(global.domain + "/api/application/servers", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + global.apikey,
},
"body": JSON.stringify({
"name": args[0],
"description": "Powered by : dcodekemii",
"user": user.id,
"egg": parseInt(15),
"docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
"startup": startup_cmd,
"environment": {
   "INST": "npm",
   "USER_UPLOAD": "0",
   "AUTO_UPDATE": "0",
   "CMD_RUN": "npm start"
},
"limits": {
   "memory": 2000,
   "swap": 0,
   "disk": 2000,
   "io": 500,
   "cpu": 80
},
"feature_limits": {
   "databases": 5,
   "backups": 5,
   "allocations": 5
},
deploy: {
   locations: [parseInt(1)],
   dedicated_ip: false,
   port_range: [],
},
})
})
let teks = '```Pesanan Panel Anda```\n\n'
teks += '```Email:```' + ` ${args[0]}@dcodekemii.shop\n`
teks += '```Username:```' + ` ${args[0]}\n`
teks += '```Password:```' + ` ${randomSevenDigitNumber}\n`
teks += '```Link Panel:```' + ` ${global.domain}\n\n`
teks += cid
await conn.sendFile(args[1] + '@c.us', 'https://telegra.ph/file/9a6cef5420c995e08a37a.jpg', '', teks, fverif)
await conn.reply(m.chat, `Success Created Panel Dengan ID: *${user.id}*`, m)
let kata = '```Server Notifikasi```\n\n'
kata += '```ID:```' + ` ${user.id}\n`
kata += '```Username:```' + ` ${user.username}\n`
kata += '```Date Time:```' + ` ${moment().format('DD/MM/YYYY HH:mm')}\n\n`
kata += cid
await conn.reply('120363264930508732@g.us', kata, null)
} else {
if (userData.errors && userData.errors[0].code === "ValidationException" && userData.errors[0].detail.includes("has already been taken")) {
return conn.reply(m.chat, 'Username atau email sudah tersedia. Harap gunakan username atau email lainnya.', m);
} else {
return conn.reply(m.chat, `Terjadi kesalahan: ${JSON.stringify(userData)}`, m);
}
}
} catch (e) {
return conn.reply(m.chat, Func.jsonFormat(e), m);
}
}

handler.tags = ['panel']
handler.command = handler.help = ['2gb']
handler.owner = true
module.exports = handler