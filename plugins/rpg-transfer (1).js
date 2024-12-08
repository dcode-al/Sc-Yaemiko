// Kemii Cantik
// Rab, 22 Mei - 17.11

let moment = require('moment-timezone');
async function handler(m, { conn, args, usedPrefix, command }) {
    conn.transfer = conn.transfer ? conn.transfer : {}
    if (args.length < 2) return conn.reply(m.chat, `• *Example :* ${usedPrefix + command} 628816609112 10000`, m)
    let amount = args[1]
    let num = m.quoted?.sender || m.mentionedJid?.[0] || args[0]
    num = num.replace(/\D/g, '') + '@s.whatsapp.net'
    let user = global.db.data.users[m.sender]
    let users = global.db.data.users[num]
    let name = await conn.getName(num)
    if (user.money < amount) return conn.reply(m.chat, `Money anda kurang dari Rp ${toRupiah(amount)} silahkan bekerja terlebih dahulu`, m)
    let text = `Info Transfer\n\n`
    text += '```Total:```' + ` Rp ${toRupiah(amount)}\n`
    text += '```Name:```' + ` ${name}\n`
    text += '```Tujuan:```' + ` ${num.split('@')[0]}\n\n`
    text += '> Kirim *Y* untuk melanjutkan proses transfer atau kirim *N* untuk membatalkan.'
    let { key } = await conn.reply(m.chat, text, m)
    conn.transfer[m.sender] = {
        total: amount,
        tujuan: num,
        usr: user,
        usrs: users,
        key,
      }
 }

handler.before = async m => {
  conn.transfer = conn.transfer ? conn.transfer : {}
  if(!(m.sender in conn.transfer)) return
  if(m.isBaileys) return
  let today = new Date()
  let tanggal = today.toLocaleDateString("id-ID", { day: 'numeric', month: 'long',  year: 'numeric' })
  let date = new Date(
  new Date().toLocaleString("en-US", {
  timeZone: "Asia/Jakarta",
  }),
  )
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let jam = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  let { key, total, tujuan, usr, usrs } = conn.transfer[m.sender]
  
  if(m.text.toLowerCase() == 'y') {
    usr.money -= total
    usrs.money += total
    let text = `ID: ${tujuan.split('@')[0]}\n`
    text += `Nominal: Rp ${toRupiah(total)}\n`
    text += `Date: ${tanggal} | ${jam}\n`
    text += `Status: Succes`
    delete conn.transfer[m.sender]
    await conn.reply(m.chat, text, m)
  } else if (m.text.toLowerCase() == 'n') {
    let text = `ID: ${tujuan.split('@')[0]}\n`
    text += `Nominal: Rp ${toRupiah(total)}\n`
    text += `Date: ${tanggal} | ${jam}\n`
    text += `Status: Cancel`
    delete conn.transfer[m.sender]
    await conn.reply(m.chat, text, m)
  }
}


handler.help = ['transfer']
handler.tags = ['rpg']
handler.register = true
handler.command = /^tfmoney|tfm$/i

module.exports = handler;

// Function To Rupiah / IDR
function toRupiah(angka) {
var saldo = '';
var angkarev = angka.toString().split('').reverse().join('');
for (var i = 0; i < angkarev.length; i++)
if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
return '' + saldo.split('', saldo.length - 1).reverse().join('');
}