let handler = m => m;

handler.before = async function(m) {
    if (!m.isGroup) return;

    try {
        let body = m.text;
        let groupMetadata = await conn.groupMetadata(m.chat);
        let participants = groupMetadata.participants;
        let sender = participants.find(v => v.id === m.sender);
        let isAdmin = sender && sender.admin !== null;

        if (!body.includes("@tagadmin") || !isAdmin) return;

        let adminIds = participants.filter(v => v.admin !== null).map(v => v.id);

        return conn.sendMessage(m.chat, { 
            text: body.replace(/@tagadmin/i, '@tagadmin'), // Replacing with "@tagadmin"
            contextInfo: {
                mentionedJid: adminIds, 
                groupMentions: [
                    {
                        groupSubject: "tagadmin",
                        groupJid: m.chat
                    }
                ]
            }
        });
    } catch (e) {
        console.error(e);
    }
};

module.exports = handler;