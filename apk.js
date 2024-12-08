let handler = async (m, { conn, text }) => {
if (!text) return m.reply("Masukan query!")
try {
m.reply("Mohon tunggu proses!")
let { data } = await require("axios")({
    "method": "GET",
    "url": "https://manaxu-seven.vercel.app/api/tools/apk?query=" + text
})
var { name, download } = data.result
conn.sendMessage(m.chat, { document: { url: download }, mimetype: 'application/vnd.android.package-archive', fileName: name + '.apk', caption: null }, { quoted: m });
} catch (e) {
return m.reply("fitur error")
}
}
handler.command = handler.help = ["apk"]
handler.tags = ["tools"]

module.exports = handler