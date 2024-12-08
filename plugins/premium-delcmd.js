let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!m.quoted)
    throw `*• Example :* ${usedPrefix + command} sticker`;
  let array = Object.keys(db.data.sticker);

  if (array.includes(await m.quoted.fileSha256.toString("base64"))) {
    await m.reply('> _Succes_')
    delete db.data.sticker[await m.quoted.fileSha256.toString("base64 ")];
  } else {
    return m.reply("> _Sticker Tidak Memiliki data_");
  }
};

handler.help = ["delcmd *<sticker>*"]
handler.tags = ["premium"];
handler.command = ["delcmd"];
handler.premium = true;
handler.register = true

module.exports = handler;