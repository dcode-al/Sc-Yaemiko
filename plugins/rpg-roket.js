let handler = async (m, { conn }) => {
  let __timers = new Date() - global.db.data.users[m.sender].lastngojek;
  let _timers = 300000 - __timers;
  let order = global.db.data.users[m.sender].ojekk;
  let timers = clockString(_timers);
  let name = conn.getName(m.sender);
  let user = global.db.data.users[m.sender];

  if (new Date() - global.db.data.users[m.sender].lastngojek > 300000) {
    let randomaku1 = `${Math.floor(Math.random() * 10)}`;
    let randomaku2 = `${Math.floor(Math.random() * 10)}`;
    let randomaku4 = `${Math.floor(Math.random() * 5)}`;
    let randomaku3 = `${Math.floor(Math.random() * 10)}`;
    let randomaku5 = `${Math.floor(Math.random() * 10)}`.trim();

    let rbrb1 = randomaku1 * 2;
    let rbrb2 = randomaku2 * 10;
    let rbrb3 = randomaku3 * 1;
    let rbrb4 = randomaku4 * 55729229;
    let rbrb5 = randomaku5 * 32990;

    var zero1 = `${rbrb1}`;
    var zero2 = `${rbrb2}`;
    var zero3 = `${rbrb3}`;
    var zero4 = `${rbrb4}`;
    var zero5 = `${rbrb5}`;

    var dimas = [
      `
🌕

▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒
▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒
░█▀█▀█░█▀██░█▀█░█▄█▄█░
░█▀█▀█░█▀████▀█░█▄█▄█░
████████▀█████████████
🚀

👨‍🚀 Memulai penerbangan....
`,
      `
🌕

🚀
▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒
▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒
░█▀█▀█░█▀██░█▀█░█▄█▄█░
░█▀█▀█░█▀████▀█░█▄█▄█░
████████▀█████████████

➕ Dalam penerbangan....
`,
      `
🌕🚀

▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒
▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒
░█▀█▀█░█▀██░█▀█░█▄█▄█░
░█▀█▀█░█▀████▀█░█▄█▄█░
████████▀█████████████

➕ Sampai di tujuan....
`,
      `
🌕🚀

➕ Sukses Mendarat.... 👨‍🚀
`,
      `
*—[ Hasil Ngroket Astronot ]—*
➕ 💹 Uang = [ ${zero4} ]
➕ ✨ Exp = [ ${zero5} ]
➕ 😍 Mendarat Selesai = +1
➕  📥Total Mendarat Sebelumnya : ${order}
${wm}
`,
    ];

    global.db.data.users[m.sender].money += rbrb4;
    global.db.data.users[m.sender].exp += rbrb5;
    global.db.data.users[m.sender].ojekk += 1;

    let { key } = await conn.sendMessage(
      m.chat,
      { text: "Astronot Sedang Mencari Lokasi" },
      { quoted: m }
    );
    await conn.delay(3000);
    for (let i of dimas) {
      await conn.sendMessage(m.chat, { text: i, edit: key }, { quoted: m });
    }
    user.lastngojek = new Date() * 1;
  } else {
    conn.reply(
      m.chat,
      `Sepertinya Anda Sudah Kecapekan Silahkan Istirahat Dulu sekitar\n🕔 *${timers}*`,
      m
    );
  }
};

handler.tags = ["rpg", "premium"];
handler.help = ["rocket", "roket"]
handler.command = /^(roket|rocket)$/i;
handler.register = true;
handler.rpg = true;

module.exports = handler;

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  console.log({ ms, h, m, s });
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
}