let uploadImage = require('../lib/uploadImage')

async function before(m, { conn }) {
  let chat = global.db.data.chats[m.chat];
  if (chat.antiPorn) {
  if (m.formMe) return
  let q = m || m.quoted;
  let mime = q.msg?.mimetype || '';
  if (!mime) return
  let media = await q.download();
  if (!media) return
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
  let url = await uploadImage(media)
  if (url) {
  let image = await Func.fetchJson(`https://itzpire.com/tools/nsfwcheck?url=${url}`)
  let score = image.data[0].label
  if (score == 'nsfw') {
  await m.reply(`Porno Terdeteksi!`) 
  await conn.sendMessage(m.chat, { delete: m.key }) 
  }
  }
  }
}
module.exports = {
    before,
}