let handler = async (m, { conn, args, command }) => {
  conn.balapmotor = conn.balapmotor ? conn.balapmotor : {};

  switch (command) {
    case 'balapmotor':
      if (!m.message.extendedTextMessage || !m.message.extendedTextMessage.contextInfo.mentionedJid) {
        return conn.reply(m.chat, 'Tag user yang ingin diajak balapan dengan command ini!', m);
      }
      
      let taggedUser = m.message.extendedTextMessage.contextInfo.mentionedJid;

      if (taggedUser.length === 0) {
        return conn.reply(m.chat, 'Tag user yang ingin diajak balapan!', m);
      }
      
      conn.balapmotor[m.sender] = {
        challenger: m.sender,
        challenged: taggedUser,
        status: 'pending'
      };
      
      let text = `🏍️ *BALAP MOTOR* 🏍️\n\n${m.sender.split('@')[0]} menantang ${taggedUser.map(jid => '@' + jid.split('@')[0]).join(', ')} untuk balap motor!\n\nSilakan balas dengan *gas* untuk menerima tantangan atau *emoh* untuk menolak.`;
      
      conn.reply(m.chat, text, m, {
        contextInfo: { mentionedJid: taggedUser }
      });
      break;

    case 'gas':
      let session = Object.values(conn.balapmotor).find(s => s.challenged.includes(m.sender) && s.status === 'pending');
      
      if (!session) {
        return conn.reply(m.chat, 'Tidak ada tantangan balapan yang tertunda untuk Anda.', m);
      }

      session.status = 'accepted';

      let participants = [session.challenger, ...session.challenged];
      let winner = participants[Math.floor(Math.random() * participants.length)];

      // Tambahkan hadiah untuk pemenang
      let prizeTypes = [
        { type: 'coins', amount: 293800 },
        { type: 'exp', amount: 5000 },
        { type: 'item', name: 'Aerok'}
      ];
      let prize = prizeTypes[Math.floor(Math.random() * prizeTypes.length)];

      let winnerUser = global.db.data.users[winner];
      let prizeText = '';
      
      switch (prize.type) {
        case 'coins':
          winnerUser.money = (winnerUser.money || 0) + prize.amount;
          prizeText = `${prize.amount} coins!`;
          break;
        case 'exp':
          winnerUser.exp = (winnerUser.exp || 0) + prize.amount;
          prizeText = `${prize.amount} exp!`;
          break;
        case 'item':
          winnerUser.items = winnerUser.items || [];
          winnerUser.items.push(prize.name);
          prizeText = `${prize.name}!`;
          break;
      }

      let resultText = `🏍️ *BALAP MOTOR* 🏍️\n\n${session.challenger.split('@')[0]} vs ${session.challenged.map(jid => '@' + jid.split('@')[0]).join(', ')}\n\n`;
      resultText += `🚩 *Pemenang*: @${winner.split('@')[0]} 🏆\n\n`;
      resultText += `🎁 *Hadiah*: ${prizeText}`;
      
      conn.reply(m.chat, resultText, m, {
        contextInfo: { mentionedJid: participants }
      });

      delete conn.balapmotor[session.challenger];
      break;

    case 'emoh':
      let sessionReject = Object.values(conn.balapmotor).find(s => s.challenged.includes(m.sender) && s.status === 'pending');
      
      if (!sessionReject) {
        return conn.reply(m.chat, 'Tidak ada tantangan balapan yang tertunda untuk Anda.', m);
      }
      
      conn.reply(m.chat, `@${sessionReject.challenged[0].split('@')[0]} menolak tantangan balapan dari @${sessionReject.challenger.split('@')[0]}.`, m, {
        contextInfo: { mentionedJid: [sessionReject.challenger, ...sessionReject.challenged] }
      });

      delete conn.balapmotor[sessionReject.challenger];
      break;
  }
}

handler.command = /^(balapmotor|gas|emoh)$/i;
handler.tags = ['rpg'];
handler.help = ['balapmotor *@user*'];
handler.private = false;
module.exports = handler;