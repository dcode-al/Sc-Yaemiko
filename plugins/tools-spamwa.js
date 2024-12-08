let handler = async (m, { conn, text }) => {

let [nomor, pesan, jumlah] = text.split('|')
if (!nomor) throw '*[ ⚠️ ] HARAP MASUKKAN NOMOR YANG AKAN DI SPAM PESAN!*\n*PENGGUNAAN YANG BENAR:*\n*—◉ #spamwa nomor|teks|jumlah max 1000*\n*jumlah:*\n*—◉ #spamwa nomor|text|jumblah max 1000*'
if (!pesan) throw '*[ ⚠️ ] HARAP MASUKKAN PESAN KE SPAM!*\n*GUNAKAN YANG BENAR:*\n*—◉ #spamwa nomor|teks|jumlah*\n*CONTOH:*\n*—◉ #spamwa nomor|text|jumblah max 1000*'
if (jumlah && isNaN(jumlah)) throw '*[ ⚠️ ] KUANTITAS HARUS ADALAH NOMOR!*\n*PENGGUNAAN YANG TEPAT:*\n*—◉ #spamwa nomor|teks|jumlah*\n*CONTOH:*\n*—◉ #spamwa 6283181666350|bayar utang goblok|10*'

let fixedNumber = nomor.replace(/[-+<>@]/g, '').replace(/ +/g, '').replace(/^[0]/g, '62') + '@s.whatsapp.net'
let fixedJumlah = jumlah ? jumlah * 1 : 1000
if (fixedJumlah > 10) throw '*[ ⚠️ ] TERLALU BANYAK PESAN! JUMLAH HARUS KURANG DARI 10 PESAN*️'
await m.reply(`*[❗] SPAM PESAN KE NOMOR ${nomor} ITU SUKSES DILAKUKAN*\n*JUMLAH TERKIRIM:*\n*—◉ ${fixedJumlah} waktu!*`)
for (let i = fixedJumlah; i > 1; i--) {
if (i !== 0) conn.reply(fixedNumber, pesan.trim(), m)
}}
handler.help = ['spamwa <number>|<mesage>|<no of messages>']
handler.tags = ['tools']
handler.command = /^spam(wa)?$/i
handler.premium = true
handler.private = true
module.exports = handler