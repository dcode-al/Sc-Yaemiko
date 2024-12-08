let handler = async (m, {conn}) => {
let audio = {
    audio: {url: 'https://files.catbox.moe/xhuq46.mp3'},
    mimetype: 'audio/mp4',
    ptt: true,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        mediaType: 1,
        mediaUrl: '',
        title: wm,
        body: namebot,
        sourceUrl: '',
        thumbnail: await (await conn.getFile('https://telegra.ph/file/d6f44478fd2ece636755e.jpg')).data,
        renderLargerThumbnail: true
      }
    }
  };

  conn.sendMessage(m.chat, audio, { quoted: m })
}

handler.customPrefix = /^(assalam|aslam(ualaikum)?)/i;
handler.command = new RegExp();
module.exports = handler