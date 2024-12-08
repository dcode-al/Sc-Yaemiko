const fetch = require('node-fetch');

const handler = async (m, { conn, text }) => {
    let link = await conn.groupInviteCode(m.chat);
    if (!text) throw 'Mana nomer nya yg mau di add ke group!';

    let nomor = text.replace(/ /g, '').replace(/-/g, '').replace("+", '');
    
    let metadata = await conn.groupMetadata(m.chat);
    let _participants = metadata.participants.map(user => user.id);

    let users = (await Promise.all(
        nomor.split(',')
            .map(v => v.replace(/[^0-9]/g, ''))
            .filter(v => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
            .map(async v => [
                v,
                await conn.onWhatsApp(v + '@s.whatsapp.net')
            ])
    )).filter(v => v[1][0]?.exists).map(v => v[0] + '@c.us');

    if (users.length === 0) {
        return m.reply('Tidak ada nomor yang valid untuk ditambahkan.');
    }

    const response = await conn.query({
        tag: 'iq',
        attrs: {
            type: 'set',
            xmlns: 'w:g2',
            to: m.chat,
        },
        content: users.map(jid => ({
            tag: 'add',
            attrs: {},
            content: [{ tag: 'participant', attrs: { jid } }]
        }))
    });

    const addNode = response.content.find(node => node.tag === 'add');
    const participants = addNode ? addNode.content : [];

    for (const user of participants) {
        const jid = user.attrs.jid;
        if (user.attrs.error === '403') {
            let teks = `Mengundang @${jid.split('@')[0]} menggunakan Link invite...`;
            m.reply(teks);
            conn.sendMessage(jid, { text: 'https://chat.whatsapp.com/' + link })
                .catch(err => {
                    m.reply(`Gagal mengirim link undangan ke @${jid.split('@')[0]}: Pengguna sudah dikeluarkan dari grup.`);
                });
        } else if (user.attrs.error) {
            m.reply(`Gagal menambahkan @${jid.split('@')[0]}: ${user.attrs.error}`);
        }
    }
};

handler.help = ['add', '+'];
handler.tags = ['owner'];
handler.command = /^(add|\+)$/i;

handler.admin = true;
handler.group = true;
handler.botAdmin = true;

module.exports = handler;