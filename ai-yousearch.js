let handler = async(m, { conn, usedPrefix, command, text }) => {
if (!text) return conn.reply(m.chat, `• *Example :* ${usedPrefix + command} Kapan Indonesia merdeka`, m)
await m.react('🕒')
let apiURL = 'https://apisku.biz.id/api/gpt/yousearch';
let options = {
method: 'POST',
headers: {
'accept': '*/*',
'api_key': 'free',
'Content-Type': 'application/json'
},
body: JSON.stringify({
'text': text
})
};
fetch(apiURL, options)
.then(response => response.json())
.then(result => {
if (result.status) {
let hasil = result.data
conn.reply(m.chat, hasil, m).then(() => m.react(''))
} else {
conn.reply(m.chat, `Error: ${result.data}`, m).then(() => m.react('❌'))
}
})
}
handler.tags = ["ai"]
handler.help = ["yousearch *<text>*"]
handler.command = ["yousearch"]
module.exports = handler