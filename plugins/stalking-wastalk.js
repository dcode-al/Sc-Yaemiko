let moment = require('moment-timezone');
let PhoneNum = require('awesome-phonenumber');

let regionNames = new Intl.DisplayNames(['id'], { type: 'region' });

let handler = async (m, { conn, text, usedPrefix, command: cmd }) => {
    let num = m.quoted?.sender || m.mentionedJid?.[0] || text;
    if (!num) return conn.reply(m.chat, `• *Contoh :* ${usedPrefix + cmd} @tag / 628xxx`, m);
    
    num = num.replace(/\D/g, '') + '@s.whatsapp.net';
    if (!(await conn.onWhatsApp(num))[0]?.exists) return conn.reply(m.chat, '🚩 Pengguna tidak ada', m);

    let img = await conn.profilePictureUrl(num, 'image').catch(() => './src/avatar_contact.png');
    let bio = await conn.fetchStatus(num).catch(() => { });
    let name = await conn.getName(m.quoted.sender);  // Retrieve name using m.quoted.sender
    let business = await conn.getBusinessProfile(num);
    
    let format = PhoneNum(`+${num.split('@')[0]}`);
    let country = regionNames.of(format.getRegionCode('international'));
    
    let wea = `${htki} Stalking WhatsApp ${htka}\n\n*° Negara :* ${country.toUpperCase()}\n*° Nama :* ${name}\n*° Format Nomor :* ${format.getNumber('international')}\n*° Url Api :* wa.me/${num.split('@')[0]}\n*° Sebutan :* @${num.split('@')[0]}\n*° Status :* ${bio?.status || '-'}\n*° Tanggal Status :* ${bio?.setAt ? moment(bio.setAt.toDateString()).locale('id').format('LL') : '-'}\n\n${business ? `${htki} Stalking Bisnis WhatsApp ${htka}\n\n*° BusinessId :* ${business.wid}\n*° Website :* ${business.website || '-'}\n*° Email :* ${business.email || '-'}\n*° Kategori :* ${business.category}\n*° Alamat :* ${business.address || '-'}\n*° Zona Waktu :* ${business.business_hours.timezone || '-'}\n*° Deskripsi :* ${business.description || '-'}` : '*Akun WhatsApp Standar*'}`;

    img ? await conn.sendMessage(m.chat, { image: { url: img }, caption: wea, mentions: [num] }, { quoted: m }) : m.reply(wea);
}

handler.help = ['wastalk *<text>*'];
handler.tags = ['stalking'];
handler.command = /^(wa|whatsapp)stalk$/i;

module.exports = handler;