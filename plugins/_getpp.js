let fetch = require("node-fetch");

let handler = async (m, { conn }) => {
  let args = m.text.split(' ');
  let phoneNumber = args[1] || '';
  let who;

  try {
    if (phoneNumber) {
      if (!/^\d+$/.test(phoneNumber)) {
        return conn.sendMessage(m.chat, { text: 'Nomor telepon hanya boleh berisi angka 0-9.' }, { quoted: m });
      }

      who = `${phoneNumber}@s.whatsapp.net`;
    } else if (m.isGroup) {
      who = m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted?.sender
        ? m.quoted.sender
        : m.sender;
    } else {
      // Dalam chat pribadi, gunakan pengguna yang reply atau pengirim
      who = m.quoted?.sender || m.sender;
    }
    let pp = await conn.profilePictureUrl(who, 'image').catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");
    await conn.sendFile(m.chat, pp, "profile.jpg", `Profile picture of @${who.split('@')[0]}`, m, null, {
      mentions: [who]
    });
  } catch (error) {
    console.error("Error fetching profile picture:", error);

    // Kirim gambar default jika terjadi error
    let defaultImageUrl = "https://telegra.ph/file/24fa902ead26340f3df2c.png";
    await conn.sendFile(m.chat, defaultImageUrl, "default.jpg", "Unable to fetch profile picture.", m);
  }
};

handler.help = ['getpp <@tag/reply> or getpp <number>'];
handler.tags = ['group'];
handler.command = /^(getpp|pp|getpict)$/i;
handler.group = false;

module.exports = handler;