let uploadFile = require('node-fetch')
let uploadImage = require('../lib/uploadImage')
let FormData = require("form-data");
let { fromBuffer } = require("file-type");
let fakeUserAgent = require("fake-useragent");
let crypto = require("crypto");
let randomBytes = crypto.randomBytes(5).toString("hex")
let createFormData = (content, fieldName, ext) => {
  let { mime } = fromBuffer(content) || {};
  let formData = new FormData();
  formData.append(fieldName, content, `${randomBytes}.${ext}`);
  return formData;
};

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'reply image!'
  conn.sendMessage(m.chat, {
    react: {
      text: '⏱️',
      key: m.key,
    }
  });
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
  try {
  let link = await (isTele ? uploadImage : uploadFile)(media)
  m.reply(`${link}
${media.length} Byte(s)
${isTele ? '(Tidak Ada Tanggal Kedaluwarsa)' : '(Tidak diketahui)'}`)
  } catch (e) {
   let kemii = await catbox(await m.quoted.download())
   m.reply(`${kemii}
${media.length} Byte(s)
${isTele ? '(Tidak Ada Tanggal Kedaluwarsa)' : '(Tidak diketahui)'}`)
  }
}
handler.help = ['tourl <reply image>']
handler.tags = ['tools']
handler.command = /^(upload|tourl)$/i

module.exports = handler

async function catbox(content) {
    try {
      const { ext, mime } = (await fromBuffer(content)) || {};
      const formData = createFormData(content, "fileToUpload", ext);
      formData.append("reqtype", "fileupload");
      const response = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: formData,
        headers: {
          "User-Agent": fakeUserAgent(),
        },
      });
      return await response.text();
    } catch (error) {
      throw false;
    }
}