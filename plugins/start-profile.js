let fetch = require("node-fetch");
let levelling = require('../lib/levelling');

let handler = async (m, { conn, command }) => {
  try {
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
    else who = m.quoted.sender ? m.quoted.sender : m.sender;

    let ppUrl = await conn.profilePictureUrl(who, 'image').catch((_) => "https://telegra.ph/file/02955a4f24f13a779d0b1.jpg");
    let pp = await (await fetch(ppUrl)).buffer();

    let user = global.db.data.users[who];
    let username = user.name;
    let alamat = user.alamat ? user.alamat : "Gapunya Rumah";
    let { min, xp, max } = levelling.xpRange(user.level, global.multiplier);
    let limit = user.premium ? '∞' : user.limit;
    let balance = user.money > 9999999999 ? '4̶0̶4̶ N̶o̶t̶ F̶o̶u̶n̶d̶' : user.money;
    let saldo = user.saldo;
    let level = user.level > 9999 ? '4̶0̶4̶ N̶o̶t̶ F̶o̶u̶n̶d̶' : user.level;
    let role = user.role;
    let rank = user.owner ? 'Immortality' : user.premium ? 'Sepuh' : 'Kroco';
    let point = user.point;
    let age = user.age > 4000 ? 'Unknown' : user.age;
    let isPremium = user.premium ? "✓" : "X";
    let isRegister = user.registered ? "✓" : "X";
    let agama = user.agama ? user.agama : "Ateis";
    let gender = user.gender ? user.gender : "Bencong";
    let premiumExpired = user.premium ? new Date(user.premiumDate).toDateString() : "Not Found";
    let pasangan = user.pasangan ? global.db.data.users[user.pasangan].name : 'Not Have';
    let banned = user.banned ? true : false;
    let warn = user.warn ? true : false;
    let bersahabat = user.bersahabat ? global.db.data.users[user.bersahabat].name : 'Not Have';
    let account = user.youtube_account ? user.youtube_account : "Belum Bikin";
    let subscribers = user.subscribers;
    let viewers = user.viewers;
    let like = user.like;

    let caption = '*P R O F I L E - M U*\n\n';
    caption += '```Nama:```' + ` ${username}\n`;
    caption += '```Kelamin:```' + ` ${gender}\n`;
    caption += '```Agama:```' + ` ${agama}\n`;
    caption += '```Umur:```' + ` ${age}\n`;
    caption += '```Kota:```' + ` ${alamat}\n`;
    caption += '```Pasangan:```' + ` ${pasangan.split`@`[0]}\n`;
    caption += '```Rank:```' + ` ${rank}\n`;
    caption += '```Sahabat:```' + ` ${bersahabat}\n\n`;
    caption += '*P R O F I L E - S T A T U S*\n\n';
    caption += '```Banned:```' + ` ${banned ? '✓' : 'X'}\n`;
    caption += '```Warn:```' + ` ${warn ? '✓' : 'X'}\n`;
    caption += '```Register:```' + ` ${isRegister}\n`;
    caption += '```Premium:```' + ` ${isPremium}\n`;
    caption += '```PremExpired:```' + ` ${premiumExpired}\n\n`;
    caption += '*R P G - S T A T U S*\n\n';
    caption += '```Health:```' + ` ${user.health}%\n`;
    caption += '```Stamina:```' + ` ${user.stamina}%\n`;
    caption += '```Money:```' + ` ${toRupiah(user.money)}\n`;
    caption += '```Level:```' + ` ${level}\n`;
    caption += '```Point:```' + ` ${toRupiah(point)}\n`;
    caption += '```Limit:```' + ` ${limit}\n`;
    caption += '```Role:```' + ` ${role}\n\n`;
    caption += '*Y O U T U B E - A C C O U N T*\n\n';
    caption += '```Channel Name:```' + ` ${account}\n`;
    caption += '```Total Subscribe:```' + ` ${toRupiah(subscribers)}\n`;
    caption += '```Total Viewer:```' + ` ${toRupiah(viewers)}\n`;
    caption += '```Total Like:```' + ` ${toRupiah(like)}\n`;

    conn.sendMessage(m.chat, {
      text: caption.trim(),
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: 'FurinaV3',
          body: 'Version: 3.0.1',
          thumbnailUrl: ppUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
  } catch {
    let sender = m.sender;
    let ppUrl = await conn.profilePictureUrl(sender, 'image').catch((_) => "https://telegra.ph/file/02955a4f24f13a779d0b1.jpg");

    let user = global.db.data.users[sender];
    let username = user.name;
    let alamat = user.alamat ? user.alamat : "Gapunya Rumah";
    let { min, xp, max } = levelling.xpRange(user.level, global.multiplier);
    let limit = user.premium ? '∞' : user.limit;
    let balance = user.money > 9999999999 ? '4̶0̶4̶ N̶o̶t̶ F̶o̶u̶n̶d̶' : user.money;
    let saldo = user.saldo;
    let level = user.level > 9999 ? '4̶0̶4̶ N̶o̶t̶ F̶o̶u̶n̶d̶' : user.level;
    let role = user.role;
    let rank = user.owner ? 'Immortality' : user.premium ? 'Sepuh' : 'Kroco';
    let point = user.point;
    let age = user.age > 4000 ? 'Unknown' : user.age;
    let isPremium = user.premium ? "✓" : "X";
    let isRegister = user.registered ? "✓" : "X";
    let agama = user.agama ? user.agama : "Ateis";
    let gender = user.gender ? user.gender : "Bencong";
    let premiumExpired = user.premium ? new Date(user.premiumDate).toDateString() : "Not Found";
    let pasangan = user.pasangan ? global.db.data.users[user.pasangan].name : 'Not Have';
    let banned = user.banned ? true : false;
    let warn = user.warn ? true : false;
    let bersahabat = user.bersahabat ? global.db.data.users[user.bersahabat].name : 'Not Have';
    let account = user.youtube_account ? user.youtube_account : "Belum Bikin";
    let subscribers = user.subscribers;
    let viewers = user.viewers;
    let like = user.like;

    let caption = '*P R O F I L E - M U*\n\n';
    caption += '```Nama:```' + ` ${username}\n`;
    caption += '```Kelamin:```' + ` ${gender}\n`;
    caption += '```Agama:```' + ` ${agama}\n`;
    caption += '```Umur:```' + ` ${age}\n`;
    caption += '```Kota:```' + ` ${alamat}\n`;
    caption += '```Pasangan:```' + ` ${pasangan.split`@`[0]}\n`;
    caption += '```Rank:```' + ` ${rank}\n`;
    caption += '```Sahabat:```' + ` ${bersahabat}\n\n`;
    caption += '*P R O F I L E - S T A T U S*\n\n';
    caption += '```Banned:```' + ` ${banned ? '✓' : 'X'}\n`;
    caption += '```Warn:```' + ` ${warn ? '✓' : 'X'}\n`;
    caption += '```Register:```' + ` ${isRegister}\n`;
    caption += '```Premium:```' + ` ${isPremium}\n`;
    caption += '```PremExpired:```' + ` ${premiumExpired}\n\n`;
    caption += '*R P G - S T A T U S*\n\n';
    caption += '```Health:```' + ` ${user.health}%\n`;
    caption += '```Stamina:```' + ` ${user.stamina}%\n`;
    caption += '```Money:```' + ` ${toRupiah(user.money)}\n`;
    caption += '```Level:```' + ` ${level}\n`;
    caption += '```Point:```' + ` ${toRupiah(point)}\n`;
    caption += '```Limit:```' + ` ${limit}\n`;
    caption += '```Role:```' + ` ${role}\n\n`;
    caption += '*Y O U T U B E - A C C O U N T*\n\n';
    caption += '```Channel Name:```' + ` ${account}\n`;
    caption += '```Total Subscribe:```' + ` ${toRupiah(subscribers)}\n`;
    caption += '```Total Viewer:```' + ` ${toRupiah(viewers)}\n`;
    caption += '```Total Like:```' + ` ${toRupiah(like)}\n`;
    conn.sendMessage(m.chat, {
    text: caption.trim(), 
    contextInfo: {
    mentionedJid: [m.sender],
    externalAdReply: {
    title: 'FurinaV5',
    body: 'Version: 3.0.1',
    thumbnailUrl: ppUrl,
    mediaType: 1,
    renderLargerThumbnail: true
    }}}, {quoted: m})
}
};

handler.command = /^(profile|me)$/i
handler.help = ['profile *@user*'];
handler.tags = ['start', 'rpg'];
handler.rpg = true;
handler.register = false;

module.exports = handler;

function toRupiah(angka) {
var saldo = '';
var angkarev = angka.toString().split('').reverse().join('');
for (var i = 0; i < angkarev.length; i++)
if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
return '' + saldo.split('', saldo.length - 1).reverse().join('');
}

function formatRupiah(number) {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return formatter.format(number);
}