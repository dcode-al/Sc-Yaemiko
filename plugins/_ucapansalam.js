module.exports.before = async (m, { conn, participants }) => {
  if (!conn.danil_join) {
    conn.danil_join = {
      join: false,
      time: 0,
    };
  }

  const currentTime = Math.floor(Date.now() / 1000);

  if (!m.isGroup || conn.danil_join.time > currentTime) {
    console.log("Not a group message or still in cooldown");
    return;
  }
  
    // user premium
    const isCek = global.db.data.users[m.sender];

  let messageText = "";
  let mentionedUsers = participants.map((u) => u.id).filter((v) => v !== conn.user.jid);
  switch (m.sender) {
    case "6289531639634@s.whatsapp.net":
      messageText = "Selamat Datang *Owner Tercinta kuu* ";
      break;
    case "6283117190494@s.whatsapp.net":
      messageText = "Perhatian, *Owner Veemon* Telah datang!";
      break;
default:
      if (isCek.premium) {
      messageText = "Selamat datang, *user premium !*";
}
break;
}
  if (messageText) {
    await conn.sendMessage( m.chat,{ text: messageText, },
      {
        quoted: fkon,
        mentions: mentionedUsers,
      }
    );
    conn.danil_join = {
      join: true,
      time: currentTime + 600,
    };
  } else {
    console.log("No message to send");
  }
};