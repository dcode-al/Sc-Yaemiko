let fetch = require('node-fetch');

let handler = async (m, { conn, text }) => {
try {
let response = await fetch(global.domain + "/api/client/account", {
method: "GET",
headers: {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + global.c_apikey,
}
});

let data = await response.json();
         
if (response.ok) {
let userData = data.attributes;

let kemii = '*A C O U N T - M E*\n\n'
kemii += '```User ID:```' + ` ${userData.id}\n`
kemii += '```Is Admin:```' + ` ${userData.admin ? "Yes" : "No"}\n`
kemii += '```Username:```' + ` ${userData.username}\n`
kemii += '```Email:```' + ` ${userData.email}\n`
kemii += '```First Name:```' + ` ${userData.first_name}\n`
kemii += '```Last Name:```' + ` ${userData.last_name}\n`
kemii += '```Language:```' + ` ${userData.language}\n\n`
kemii += `ID-${Func.makeId(15)}`

conn.reply(m.chat, kemii, m);
} else {
return conn.reply(m.chat, `Terjadi kesalahan: ${JSON.stringify(data)}`, m);
}
} catch (e) {
console.error(e);
return conn.reply(m.chat, 'Terjadi kesalahan dalam menjalankan permintaan Anda.', m);
}
}

handler.tags = ['panel']
handler.command = handler.help = ['cekakunme']
handler.owner = true
module.exports = handler