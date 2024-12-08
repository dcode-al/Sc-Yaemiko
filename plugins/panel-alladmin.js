let fetch = require('node-fetch');

let handler = async (m, { conn }) => {
try {
let response = await fetch(global.domain + "/api/application/users", {
method: "GET",
headers: {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + global.apikey,
}
});

let data = await response.json();
         
if (response.ok) {

let userList = '*A L L - A D M I N D*\n\n'

let adminList = data.data
.filter(user => user.attributes.root_admin)
.map(user => {
userList += '```ID:```' + ` ${user.attributes.id}\n`
userList += '```Username:```' + ` ${user.attributes.username}\n`
userList += '```Email:```' + ` ${user.attributes.email}\n`
userList += '```First Name:```' + ` ${user.attributes.first_name}\n`
userList += '```Last Name:```' + ` ${user.attributes.last_name}\n`
userList += '```Language:```' + ` ${user.attributes.language}\n`
userList += '```Root Admin:```' + ` ${user.attributes.root_admin ? 'Yes' : 'No'}\n`
userList += '```2FA:```' + ` ${user.attributes['2fa'] ? 'Enabled' : 'Disabled'}\n`
userList += '```Created At:```' + `${user.attributes.created_at}\n\n`
})
conn.reply(m.chat, `${userList}${global.cid}`, m);
} else {
return conn.reply(m.chat, `Terjadi kesalahan: ${JSON.stringify(data)}`, m);
}
} catch (e) {
console.error(e);
return conn.reply(m.chat, 'Terjadi kesalahan dalam menjalankan permintaan Anda.', m);
}
}

handler.tags = ['panel']
handler.command = handler.help = ['alladmin']
handler.owner = true
module.exports = handler