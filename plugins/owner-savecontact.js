const fs = require('fs');
const util = require('util');
const { groupMetadata } = require('@whiskeysockets/baileys');

const contacts = JSON.parse(fs.readFileSync('./system/contacts.json', 'utf8'));
const createSerial = (length) => [...Array(length)].map(() => Math.random().toString(36)[2]).join('');

let handler = async (m, { conn, command, args, isOwner }) => {
    if (!isOwner) return m.reply('Only the owner can use this command.');

    let text = args[0];
    if (!text) return m.reply(`
*Usage:* 

${command} idgroup

To view Group IDs, type .cekidgc`);
    
    await m.reply('Please wait...');
    
    try {
        let groupMetadataa;
        let participants = [];

        if (!m.isGroup) {
            groupMetadataa = await conn.groupMetadata(text);
            participants = groupMetadataa.participants;
        }

        const halls = participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
        
        halls.forEach(mem => {
            if (!contacts.includes(mem)) {
                contacts.push(mem);
            }
        });

        fs.writeFileSync('./system/contacts.json', JSON.stringify(contacts));

        const uniqueContacts = [...new Set(contacts)];
        const vcardContent = uniqueContacts.map((contact, index) => {
            const vcard = [
                "BEGIN:VCARD",
                "VERSION:3.0",
                `FN:WA[${createSerial(2)}] ${contact.split("@")[0]}`,
                `TEL;type=CELL;type=VOICE;waid=${contact.split("@")[0]}:+${contact.split("@")[0]}`,
                "END:VCARD",
                "",
            ].join("\n");
            return vcard;
        }).join("");

        if (vcardContent.trim().length === 0) {
            throw new Error("No valid contacts found.");
        }

        fs.writeFileSync("./system/contacts.vcf", vcardContent, "utf8");

        await conn.sendMessage(m.sender, {
            document: fs.readFileSync("./system/contacts.vcf"),
            fileName: "contacts.vcf",
            caption: `
 *HOW TO USE:*
 *1. Download the File*
 *2. Open the File*
 *3. Import to Contacts*
 *4. Choose the Email to Use*

Done`,
            mimetype: "text/vcard",
        }, { quoted: m });

        // Clear contacts array after processing
        contacts.splice(0, contacts.length);
        fs.writeFileSync("./system/contacts.json", JSON.stringify(contacts));

        await m.reply('Success!');
    } catch (err) {
        console.error(err);
        return m.reply(util.format(err));
    }
};

handler.command = ['savecontact']; 
handler.owner = true;

module.exports = handler;