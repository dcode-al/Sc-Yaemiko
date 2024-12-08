let fetch = require('node-fetch');

let handler = async (m, { conn }) => {
try {
let response = await fetch(global.domain + "/api/application/servers", {
method: "GET",
headers: {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + global.apikey,
}
});

let data = await response.json();
         
if (response.ok) {
let totalServers = data.meta.pagination.total;
let servers = data.data;

let serverList = '*A L L - S E R V E R*\n\n'

servers.forEach(server => {
let serverInfo = server.attributes;
serverList += '```Server ID:```' + ` ${serverInfo.id}\n`
serverList += '```Server Name:```' + ` ${serverInfo.name}\n`
serverList += '```Code Server:```' + ` ${serverInfo.identifier}\n`
serverList += '```User ID:```' + ` ${serverInfo.user}\n`
serverList += '```Suspended:```' + ` ${serverInfo.suspended ? "Yes" : "No"}\n`
serverList += '```Updated At:```' + ` ${serverInfo.updated_at}\n`
serverList += '```Created At:```' + ` ${serverInfo.created_at}\n\n`
});

conn.reply(m.chat, `${serverList}${global.cid}`, m);
} else {
return conn.reply(m.chat, `Terjadi kesalahan: ${JSON.stringify(data)}`, m);
}
} catch (e) {
console.error(e);
return conn.reply(m.chat, 'Terjadi kesalahan dalam menjalankan permintaan Anda.', m);
}
}

handler.tags = ['panel']
handler.command = handler.help = ['allserver']
handler.owner = true
module.exports = handler