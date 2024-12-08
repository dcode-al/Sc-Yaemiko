let handler = async (m, { conn, usedPrefix, command }) => {
  const data = db.data.sticker;
  let text = ""
  for (const kemii in data) {
    let capt = `> _Message: ${data[kemii].message}_\n`
    capt += `> _Creator: ${data[kemii].creator}_\n`
    capt += `> _Jid: wa.me/${data[kemii].jid.split("@")[0]}_\n`
    capt += `> _Sticker: ${data[kemii].url}_`
    text += capt + '\n\n'
  }
  m.reply('```Command List```' + '```' + ` :` + '```\n\n' + `${text}` + '`Powered By ICSF Team`')
};
handler.help = ["listcmd *<sticker>*"]
handler.tags = ["premium"];
handler.command = ["listcmd"];
handler.premium = true;

module.exports = handler;