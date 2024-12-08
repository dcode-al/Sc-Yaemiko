const cekUser = (type, sender) => {
  // Misalnya, akses data dari global.db.data.user
  if (global.db.data.user && global.db.data.user[sender]) {
    return global.db.data.user[sender]; // Mengembalikan objek pengguna jika ditemukan
  }
  return null; // Mengembalikan null jika pengguna tidak ditemukan
};

let handler = async (m, { conn, command, args, usedPrefix, sender, isOwner }) => {
  // Memeriksa apakah pengguna terdaftar menggunakan cekUser
  let user = cekUser("id", m.sender);
  if (!user) {
    await conn.sendMessage(m.chat, {
      text: `Maaf *@${m.sender.split('@')[0]}*, sepertinya kamu belum terdaftar di database. Silahkan daftar terlebih dahulu sebelum ${command}`,
      mentions: [m.sender]
    }, {
      quoted: m
    });
    return;
  }

  // Memeriksa apakah pengirim adalah pemilik bot
  if (!isOwner) {
    await conn.reply(m.chat, 'Maaf, command ini hanya untuk pemilik.', m);
    return;
  }

  // Memeriksa apakah argumen yang diberikan sesuai format
  let t = args.join(' ').split(',');
  if (t.length < 2) {
    await conn.reply(m.chat, `*Format salah!*

Penggunaan:
${usedPrefix + command} barang,nominal`, m);
    return;
  }

  // Mengambil barang dan nominal dari argumen
  let barang = t[0].trim();
  let nominal = t[1].trim();

  // Menanggapi dengan informasi transaksi
  await conn.reply(m.chat, `*━━ TRANSAKSI INFO ━━*

 _• *Barang:* ${barang}_
 _• *Nominal:* ${nominal}_
 _• *Tanggal:* ${new Date().toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' })}_

*TERIMA KASIH TELAH ORDER DI ${global.namaown}*\n*JANGAN LUPA ORDER LAGI YA*🙏`, m);
};

handler.tags = ['owner'];
handler.help = ['done1'];
handler.command = /^(done1)$/i;
handler.owner = true;

module.exports = handler;