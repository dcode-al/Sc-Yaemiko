const {
  getAggregateVotesInPollMessage,
  generateWAMessage,
  proto,
  normalizeMessageContent,
  areJidsSameUser,
  jidNormalizedUser,
  getKeyAuthor,
  decryptPollVote
} = require("@whiskeysockets/baileys");

async function before(m, options) {
  if (m.isBaileys || !m.message?.pollUpdateMessage) {
    return;
  }

  const normalizedContent = normalizeMessageContent(m.message);
  if (!normalizedContent) {
    return;
  }

  const pollUpdateKey = normalizedContent.pollUpdateMessage.pollCreationMessageKey;
  const pollMessage = store.messages[m.chat]?.array?.find(msg => pollUpdateKey.id === msg.key.id);
  if (!pollMessage) {
    return;
  }

  const pollCreationMessage = pollMessage.message;
  const userJid = jidNormalizedUser(this.authState.creds.me.id);
  const authorJid = getKeyAuthor(m.key, userJid);
  const pollCreatorJid = getKeyAuthor(pollUpdateKey, userJid);
  const pollEncKey = pollCreationMessage.messageContextInfo?.messageSecret;
  const decryptedVote = decryptPollVote(normalizedContent.pollUpdateMessage.vote, {
    pollEncKey: pollEncKey,
    pollCreatorJid: pollCreatorJid,
    pollMsgId: pollUpdateKey.id,
    voterJid: authorJid
  });
  if (!decryptedVote) {
    return;
  }

  const pollUpdates = [{
    key: pollUpdateKey,
    update: {
      pollUpdates: [{
        pollUpdateMessageKey: m.key,
        vote: decryptedVote,
        senderTimestampMs: m.messageTimestamp
      }]
    }
  }];
  const aggregateVotes = await getAggregateVotesInPollMessage({
    message: pollCreationMessage,
    pollUpdates: pollUpdates[0].update.pollUpdates
  });
  if (!aggregateVotes) {
    return;
  }

  const pollResult = aggregateVotes?.find(vote => vote.voters.length !== 0)?.name;
  if (!pollResult) {
    return;
  }

  const resultText = '.' + pollResult;
  await this.sendMessage(m.chat, {
    delete: pollMessage
  });
  await appendTextMessage(m, resultText, options);
}

appendTextMessage = async (m, text, options) => {
  let message = await generateWAMessage(m.chat, {
    text: text,
    mentions: m.mentionedJid || [m.sender]
  }, {
    userJid: conn.user?.jid || conn.user?.id,
    quoted: m.quoted && m.quoted?.fakeObj
  });
  message.key.fromMe = areJidsSameUser(m.sender, conn.user?.jid || conn.user?.id);
  message.key.id = m.key.id;
  message.pushName = m.pushName || m.name;
  if (m.isGroup) {
    message.participant = m.sender || m.key.remoteJid || m.chat;
  }
  let messageUpdate = {
    ...options,
    messages: [proto.WebMessageInfo.fromObject(message)],
    type: "append"
  };
  conn.ev.emit("messages.upsert", messageUpdate);
};

module.exports = {
  before
};