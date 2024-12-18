const fs = require("fs");
const jimp_1 = require("jimp");
const { S_WHATSAPP_NET } = require('@whiskeysockets/baileys')

let handler = async (m, { conn, command, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || q.mediaType || "";
  m.reply(wait);
  if (/image/g.test(mime) && !/webp/g.test(mime)) {
    try {
      let media = await q.download();
      let botNumber = await conn.user.jid;
      let { img } = await pepe(media);
      await conn.query({
        tag: "iq",
        attrs: {
          to: S_WHATSAPP_NET,
          type: "set",
          xmlns: "w:profile:picture",
        },
        content: [
          {
            tag: "picture",
            attrs: { type: "image" },
            content: img,
          },
        ],
      });
      m.reply(`*✅ Successfully replaced PP*`);
    } catch (e) {
      console.log(e);
      m.reply(`*An error occurred, please try again later.*`);
    }
  } else {
    m.reply(Func.example(usedPrefix, command, " *[reply/send media]*"));
  }
};

handler.help = ["setppbot"].map((a) => a + " *[update profile bot]*");
handler.tags = ["owner"];
handler.command = /^setpp(bot)?$/i

handler.owner = true;

module.exports = handler;

async function pepe(media) {
  const jimp = await jimp_1.read(media);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(720, 720).getBufferAsync(jimp_1.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(jimp_1.MIME_JPEG),
  };
}