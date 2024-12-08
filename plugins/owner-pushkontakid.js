const fs = require('fs');
const path = require('path');

let handler = async (m, { isOwner, text, prefix, command, conn, mess = {}, quoted, mime, uptotelegra, sleep, from }) => {
    if (!isOwner) return m.reply(`Khusus Bang Indra Kontol`);
    if (m.isGroup) return m.reply(mess.only?.private ? mess.only.private : "Perintah ini hanya dapat digunakan dalam percakapan pribadi.");
    if (!text) return m.reply(`Penggunaan Salah Silahkan Gunakan Command Seperti Ini\n${prefix + command} idgroup|tekspushkontak\nUntuk Liat Id Group Silahkan Ketik .cekidgc`);

    m.reply(mess.wait || 'Tunggu sebentar...');

    const groupId = text.split("|")[0];
    const pushMessage = text.split("|")[1];

    let groupMetadata;
    let participants;
    let contacts = [];

    if (!m.isGroup) {
        try {
            groupMetadata = await conn.groupMetadata(groupId);
            participants = groupMetadata.participants;
        } catch (e) {
            console.error(e);
            return m.reply(`Error saat mengambil metadata grup.`);
        }
    }

    const filteredParticipants = participants.filter(v => v.id.endsWith('.net')).map(v => v.id);

    global.tekspushkon = pushMessage;

    const sendMessageWithDelay = async (mem) => {
        if (m.isContacts) return;

        contacts.push(mem);
        fs.writeFileSync('./system/contacts.json', JSON.stringify(contacts));

        try {
            if (/image/.test(mime) && quoted) {
                const media = await conn.downloadAndSaveMediaMessage(quoted);
                const memk = await uptotelegra(media);

                await conn.sendMessage(mem, { image: { url: memk }, caption: global.tekspushkon }, { quoted: fverif });
            } else {
                await conn.sendMessage(mem, { text: global.tekspushkon }, { quoted: fverif });
            }
            await sleep(10000); // 5-second delay
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle specific error cases if needed
        }
    };

    for (let mem of filteredParticipants) {
        await sendMessageWithDelay(mem);
    }

    // Ensure the directory exists
    const systemDir = path.join(__dirname, '../system');
    if (!fs.existsSync(systemDir)) {
        fs.mkdirSync(systemDir);
    }

    try {
        const uniqueContacts = [...new Set(contacts)];
        const vcardContent = uniqueContacts.map((contact, index) => {
            const vcard = [
                "BEGIN:VCARD",
                "VERSION:3.0",
                `FN:thomz[${createSerial(1)}] ${contact.split("@")[0]}`,
                `TEL;type=CELL;type=VOICE;waid=${contact.split("@")[0]}:+${contact.split("@")[0]}`,
                "END:VCARD",
                "",
            ].join("\n");
            return vcard;
        }).join("");

        fs.writeFileSync(path.join(systemDir, 'contacts.vcf'), vcardContent, "utf8");
    } catch (err) {
        console.error('Error writing contacts.vcf:', err);
        return m.reply(`Error saat membuat file kontak.`);
    } finally {
        try {
            await conn.sendMessage(from, {
                document: fs.readFileSync(path.join(systemDir, 'contacts.vcf')),
                fileName: "contacts.vcf",
                caption: "Nih Kak Tinggal Pencet File Di Atas Terus Save",
                mimetype: "text/vcard",
            }, { quoted: m });
        } catch (error) {
            console.error('Error sending contacts.vcf:', error);
        }

        contacts.splice(0, contacts.length);
        fs.writeFileSync(path.join(systemDir, 'contacts.json'), JSON.stringify(contacts));
    }
};

handler.command = /^pushkontakid$/i;
handler.owner = true;
handler.tags = ["owner"];
handler.help = ["pushkontakid"];
module.exports = handler;