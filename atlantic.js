let axios = require("axios");
let fetch = require('node-fetch');
let fs = require('fs');

let handler = async (m, { conn, args, text, usedPrefix, command, isROwner }) => {
let untung = "3"
let user = global.db.data.users[m.sender]
let username = user.name;

switch (command) {
case 'atla-dana':{
let key = new URLSearchParams()
key.append("api_key", `${global.atlaapi}`)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) {
m.reply('```❎ Server maintenance.```')
conn.sendMessage(`${nomorown}@s.whatsapp.net`, { text: 'Silahkan sambungkan ip ('+res.message.replace(/[^0-9.]+/g, '')+') tersebut ke provider' }, m)
} else {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
let teks = `*HARGA - SALDO - DANA*\n\n`
res.data.sort(regeXcomp)
for (let i of res.data) {
if (i.provider == "DANA") {
let prof = (untung / 100) * i.price
teks += '```Kode : ```' + `${i.code}\n`
teks += '```Nama : ```' + `${i.name}\n`
teks += '```Harga : ```' + `Rp ${toRupiah(Number(i.price)  + Number(Math.ceil(prof)))}\n`
teks += '```Status : ```' + `${i.status == "available" ? "✅" : "❎"}\n\n`
}
}
m.reply(`${teks}\nPowered by : atlantic-pedia.co.id`)
}
})
}
break
case 'atla-ovo':{
let key = new URLSearchParams()
key.append("api_key", atlaapi)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) {
m.reply('```❎ Server maintenance.```')
conn.sendMessage(`${nomorown}@s.whatsapp.net`, { text: 'Silahkan sambungkan ip ('+res.message.replace(/[^0-9.]+/g, '')+') tersebut ke provider' }, m)
} else {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
let teks = `*HARGA - SALDO - OVO*\n\n`
res.data.sort(regeXcomp)
for (let i of res.data) {
if (i.provider == "OVO") {
let prof = (untung / 100) * i.price
teks += '```Kode : ```' + `${i.code}\n`
teks += '```Nama : ```' + `${i.name}\n`
teks += '```Harga : ```' + `Rp ${toRupiah(Number(i.price)  + Number(Math.ceil(prof)))}\n`
teks += '```Status : ```' + `${i.status == "available" ? "✅" : "❎"}\n\n`
}
}
m.reply(`${teks}\nPowered by : atlantic-pedia.co.id`)
}
})
}
break
case 'atla-gopay':{
let key = new URLSearchParams()
key.append("api_key", `${global.atlaapi}`)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) {
m.reply('```❎ Server maintenance.```')
conn.sendMessage(`${nomorown}@s.whatsapp.net`, { text: 'Silahkan sambungkan ip ('+res.message.replace(/[^0-9.]+/g, '')+') tersebut ke provider' }, m)
} else {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
let teks = `*HARGA - SALDO - GOPAY*\n\n`
res.data.sort(regeXcomp)
for (let i of res.data) {
if (i.provider == "GOPAY" && i.category == "Pulsa Reguler") {
let prof = (untung / 100) * i.price
teks += '```Kode : ```' + `${i.code}\n`
teks += '```Nama : ```' + `${i.name}\n`
teks += '```Harga : ```' + `Rp ${toRupiah(Number(i.price)  + Number(Math.ceil(prof)))}\n`
teks += '```Status : ```' + `${i.status == "available" ? "✅" : "❎"}\n\n`
}
}
m.reply(`${teks}\nPowered by : atlantic-pedia.co.id`)
}
})
}
break
case 'atla-ff':{
let key = new URLSearchParams()
key.append("api_key", `${global.atlaapi}`)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) {
m.reply('```❎ Server maintenance.```')
conn.sendMessage(`${nomorown}@s.whatsapp.net`, { text: 'Silahkan sambungkan ip ('+res.message.replace(/[^0-9.]+/g, '')+') tersebut ke provider' }, m)
} else {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
let teks = `*HARGA - PRODUK - EPEP*\n\n`
res.data.sort(regeXcomp)
for (let i of res.data) {
if (i.provider == "FREE FIRE") {
let prof = (untung / 100) * i.price
teks += '```Kode : ```' + `${i.code}\n`
teks += '```Nama : ```' + `${i.name}\n`
teks += '```Harga : ```' + `Rp ${toRupiah(Number(i.price)  + Number(Math.ceil(prof)))}\n`
teks += '```Status : ```' + `${i.status == "available" ? "✅" : "❎"}\n\n`
}
}
m.reply(`${teks}\nPowered by : atlantic-pedia.co.id`)
}
})
}
break
case 'atla-ml':{
let key = new URLSearchParams()
key.append("api_key", atlaapi)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) {
m.reply('```❎ Server maintenance.```')
conn.sendMessage(`${nomorown}@s.whatsapp.net`, { text: 'Silahkan sambungkan ip ('+res.message.replace(/[^0-9.]+/g, '')+') tersebut ke provider' }, m)
} else {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
let teks = `*HARGA - PRODUK - EMEL*\n\n`
res.data.sort(regeXcomp)
for (let i of res.data) {
if (i.provider == "MOBILE LEGENDS" && i.category !== "Membership") {
	let prof = (untung / 100) * i.price
teks += '```Kode : ```' + `${i.code}\n`
teks += '```Nama : ```' + `${i.name}\n`
teks += '```Harga : ```' + `Rp ${toRupiah(Number(i.price)  + Number(Math.ceil(prof)))}\n`
teks += '```Status : ```' + `${i.status == "available" ? "✅" : "❎"}\n\n`
}
}
m.reply(`${teks}\nPowered by : atlantic-pedia.co.id`)
}
})
}
break
case 'atla-pubg':{
let key = new URLSearchParams()
key.append("api_key", atlaapi)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) {
m.reply('```❎ Server maintenance.```')
conn.sendMessage(`${nomorown}@s.whatsapp.net`, { text: 'Silahkan sambungkan ip ('+res.message.replace(/[^0-9.]+/g, '')+') tersebut ke provider' }, m)
} else {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
let teks = `*HARGA - PRODUK - PUBG*\n\n`
res.data.sort(regeXcomp)
for (let i of res.data) {
if (i.provider == "PUBG MOBILE") {
	let prof = (untung / 100) * i.price
teks += '```Kode : ```' + `${i.code}\n`
teks += '```Nama : ```' + `${i.name}\n`
teks += '```Harga : ```' + `Rp ${toRupiah(Number(i.price)  + Number(Math.ceil(prof)))}\n`
teks += '```Status : ```' + `${i.status == "available" ? "✅" : "❎"}\n\n`
}
}
m.reply(`${teks}\nPowered by : atlantic-pedia.co.id`)
}
})
}
break
case 'atla-genshin':{
let key = new URLSearchParams()
key.append("api_key", atlaapi)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) {
m.reply('```❎ Server maintenance.```')
conn.sendMessage(`${nomorown}@s.whatsapp.net`, { text: 'Silahkan sambungkan ip ('+res.message.replace(/[^0-9.]+/g, '')+') tersebut ke provider' }, m)
} else {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
let teks = `*HARGA - PRODUK - GENSHIN*\n\n`
res.data.sort(regeXcomp)
for (let i of res.data) {
if (i.provider == "Genshin Impact") {
	let prof = (untung / 100) * i.price
teks += '```Kode : ```' + `${i.code}\n`
teks += '```Nama : ```' + `${i.name}\n`
teks += '```Harga : ```' + `Rp ${toRupiah(Number(i.price)  + Number(Math.ceil(prof)))}\n`
teks += '```Status : ```' + `${i.status == "available" ? "✅" : "❎"}\n\n`
}
}
m.reply(`${teks}\nPowered by : atlantic-pedia.co.id`)
}
})
}
break
case 'atla-zepeto':{
let key = new URLSearchParams()
key.append("api_key", atlaapi)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) {
m.reply('```❎ Server maintenance.```')
conn.sendMessage(`${nomorown}@s.whatsapp.net`, { text: 'Silahkan sambungkan ip ('+res.message.replace(/[^0-9.]+/g, '')+') tersebut ke provider' }, m)
} else {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
let teks = `*HARGA - PRODUK - ZEPETO*\n\n`
res.data.sort(regeXcomp)
for (let i of res.data) {
if (i.provider == "Zepeto") {
	let prof = (untung / 100) * i.price
teks += '```Kode : ```' + `${i.code}\n`
teks += '```Nama : ```' + `${i.name}\n`
teks += '```Harga : ```' + `Rp ${toRupiah(Number(i.price)  + Number(Math.ceil(prof)))}\n`
teks += '```Status : ```' + `${i.status == "available" ? "✅" : "❎"}\n\n`
}
}
m.reply(`${teks}\nPowered by : atlantic-pedia.co.id`)
}
})
}
break
case 'atla-axis':{
let key = new URLSearchParams()
key.append("api_key", atlaapi)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) {
m.reply('```❎ Server maintenance.```')
conn.sendMessage(`${nomorown}@s.whatsapp.net`, { text: 'Silahkan sambungkan ip ('+res.message.replace(/[^0-9.]+/g, '')+') tersebut ke provider' }, m)
} else {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
let teks = `*HARGA - PRODUK - AXIS*\n\n`
res.data.sort(regeXcomp)
for (let i of res.data) {
if (i.provider == "AXIS" && i.type !== "Pulsa Transfer" && i.category !== "Pulsa Reguler" && i.type !== "Voucher") {
let prof = (untung / 100) * i.price
teks += '```Kode : ```' + `${i.code}\n`
teks += '```Nama : ```' + `${i.name}\n`
teks += '```Harga : ```' + `Rp ${toRupiah(Number(i.price)  + Number(Math.ceil(prof)))}\n`
teks += '```Status : ```' + `${i.status == "available" ? "✅" : "❎"}\n\n`
}
}
m.reply(`${teks}\nPowered by : atlantic-pedia.co.id`)
}
})
}
break
case 'atla-three':{
let key = new URLSearchParams()
key.append("api_key", atlaapi)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) {
m.reply('```❎ Server maintenance.```')
conn.sendMessage(`${nomorown}@s.whatsapp.net`, { text: 'Silahkan sambungkan ip ('+res.message.replace(/[^0-9.]+/g, '')+') tersebut ke provider' }, m)
} else {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
let teks = `*HARGA - PRODUK - THREE*\n\n`
res.data.sort(regeXcomp)
for (let i of res.data) {
if (i.provider == "TRI" && i.category !== "Pulsa Reguler" && i.type !== "Data Internet" && i.type !== "Paket SMS & Telpon" && i.type !== "Pulsa Transfer") {
let prof = (untung / 100) * i.price
teks += '```Kode : ```' + `${i.code}\n`
teks += '```Nama : ```' + `${i.name}\n`
teks += '```Harga : ```' + `Rp ${toRupiah(Number(i.price)  + Number(Math.ceil(prof)))}\n`
teks += '```Status : ```' + `${i.status == "available" ? "✅" : "❎"}\n\n`
}
}
m.reply(`${teks}\nPowered by : atlantic-pedia.co.id`)
}
})
}
break
case 'atla-tsel':{
let key = new URLSearchParams()
key.append("api_key", atlaapi)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) {
m.reply('```❎ Server maintenance.```')
conn.sendMessage(`${nomorown}@s.whatsapp.net`, { text: 'Silahkan sambungkan ip ('+res.message.replace(/[^0-9.]+/g, '')+') tersebut ke provider' }, m)
} else {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
let teks = `*HARGA - PRODUK - TELKOMSEL*\n\n`
res.data.sort(regeXcomp)
for (let i of res.data) {
if (i.provider == "TELKOMSEL" && i.category !== "Data Internet") {
let prof = (untung / 100) * i.price
teks += '```Kode : ```' + `${i.code}\n`
teks += '```Nama : ```' + `${i.name}\n`
teks += '```Harga : ```' + `Rp ${toRupiah(Number(i.price)  + Number(Math.ceil(prof)))}\n`
teks += '```Status : ```' + `${i.status == "available" ? "✅" : "❎"}\n\n`
}
}
m.reply(`${teks}\nPowered by : atlantic-pedia.co.id`)
}
})
}
break
case 'atla-smartfrent':{
let key = new URLSearchParams()
key.append("api_key", atlaapi)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) {
m.reply('```❎ Server maintenance.```')
conn.sendMessage(`${nomorown}@s.whatsapp.net`, { text: 'Silahkan sambungkan ip ('+res.message.replace(/[^0-9.]+/g, '')+') tersebut ke provider' }, m)
} else {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
let teks = `*HARGA - PRODUK - SMARTFREN*\n\n`
res.data.sort(regeXcomp)
for (let i of res.data) {
if (i.provider == "SMARTFREN" && i.category !== "Pulsa Reguler") {
let prof = (untung / 100) * i.price
teks += '```Kode : ```' + `${i.code}\n`
teks += '```Nama : ```' + `${i.name}\n`
teks += '```Harga : ```' + `Rp ${toRupiah(Number(i.price)  + Number(Math.ceil(prof)))}\n`
teks += '```Status : ```' + `${i.status == "available" ? "✅" : "❎"}\n\n`
}
}
m.reply(`${teks}\nPowered by : atlantic-pedia.co.id`)
}
})
}
break
case 'atla-order':{
if (user.saldo < 1) {
return conn.reply(m.chat, `Hello *${username}* sepertinya saldo kamu Rp${toRupiah(user.saldo)}, silahkan deposit dahulu sebelum melakukan topup.`, m)
}
let [kodep, idp] = text.split `,`
if (!kodep) return m.reply(`• *Example :* ${command}${usedPrefix} FF100,IDFF`)
if (!idp) return m.reply(`• *Example :* ${command}${usedPrefix} FF100,IDFF`)
conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
let cekhar = new URLSearchParams()
cekhar.append("api_key", atlaapi)
cekhar.append("type", "prabayar")
fetch("https://atlantich2h.com/layanan/price_list", {
method: "POST",
body: cekhar,
redirect: 'follow'
})
.then(responsee => responsee.json())
.then(ress => {
let listproduk
for (let x of ress.data) {
if (x.code == kodep) {
listproduk = x ? x : false
}
}
if (!listproduk) return m.reply(`_Code produk *${q.split(",")[0]}* Tidak sesuai_`)
let kntungan = (untung / 100) * listproduk.price.replace(/[^0-9]/g, '')
if (user.saldo < listproduk.price.replace(/[^0-9]/g, '') + Number(Math.ceil(kntungan))) {
return conn.reply(m.chat, `Hello *${username}* sepertinya saldo kamu kurang Rp${toRupiah(listproduk.price.replace(/[^0-9]/g,) + Number(Math.ceil(kntungan)))}, silahkan deposit dahulu sebelum melakukan membeli produk ini!.`, m)
}
let kemii = new URLSearchParams()
kemii.append("api_key", atlaapi)
kemii.append("code", kodep)
kemii.append("reff_id", require("crypto").randomBytes(5).toString("hex").toUpperCase())
kemii.append("target", idp)
fetch("https://atlantich2h.com/transaksi/create", {
method: "POST",
body: kemii,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (!res.status) return m.reply('```Server maintenance.```')
let persen = (untung / 100) * res.data.price
let capt = `*TRANSAKSI - DIPROSES*\n\n`
capt += '```ID : ```' + `${res.data.id}\n`
capt += '```Layanan : ```' + `${res.data.layanan}\n`
capt += '```Kode : ```' + `${res.data.code}\n`
capt += '```Target : ```' + `${res.data.target}\n`
capt += '```Harga : ```' + `Rp ${toRupiah(Number(res.data.price) + Number(Math.ceil(persen)))}\n\n`
capt += 'Powered by : atlantic-pedia.co.id'
conn.reply(m.chat, capt, m)
setTimeout(async () => {
let key = new URLSearchParams()
key.append("api_key", atlaapi)
key.append("id", res.data.id)
key.append("type", "prabayar")
fetch("https://atlantich2h.com/transaksi/status", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(response => response.json())
.then(res => {
if (res.data.status === "success") {
let persen = (untung / 100) * res.data.price
let kata = '*TRANSAKSI - SUKSES*\n\n'
kata += '```Status : ```' + 'Suksess\n'
kata += '```ID : ```' + `${res.data.id}\n`
kata += '```Layanan : ```' + `${res.data.layanan}\n`
kata += '```Target : ```' + `${res.data.target}\n`
kata += '```Harga : ```' + `Rp ${toRupiah(Number(res.data.price) + Number(Math.ceil(persen)))}\n\n`
kata += '```Sn : ```' + `${res.data.sn}\n\n`
kata += 'Powered by : atlantic-pedia.co.id'
conn.reply(m.chat, kata, m)
global.db.data.users[m.sender].saldo -= res.data.price
} else if (res.data.status === 'error') {
m.reply('```❌Pesanan dibatalkan!\nAlasan :```' + `${res.data.message}`)
}
})
}, 3000)
})
})
}
break
case 'atla-depo':{
if (!isROwner) {
global.dfail('rowner', m, conn)
throw false
}
if (!text) return m.reply(`• *Example :* ${usedPrefix}depoatla 5000`)
conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
let cekhar = new URLSearchParams()
cekhar.append("api_key", atlaapi)
cekhar.append("reff_id", `Kemii` + `${getRandomInt(100, 900)}`)
cekhar.append("nominal", text)
cekhar.append("type", "ewallet")
cekhar.append("metode", "qris")
fetch("https://atlantich2h.com/deposit/create", {
method: "POST",
body: cekhar,
redirect: 'follow'
})
.then(responsee => responsee.json())
.then(ress => {
let teks = '*DEPOSIT - ATLANTIC*\n\n'
teks += '```ID : ```' + `${ress.data.id}\n`
teks += '```Metode : ```' + `Qris\n`
teks += '```Nominal : ```' + `Rp ${toRupiah(ress.data.nominal)}\n`
teks += '```Expired : ```' + `${ress.data.expired_at}\n\n`
teks += 'Powered by : atlantic-pedia.co.id'
conn.sendFile(m.chat, `${ress.data.qr_image}`, 'depoatla.jpg', teks, m)
if (ress.data.status === "processing") {
let key = new URLSearchParams()
key.append("api_key", atlaapi)
key.append("id", ress.data.id)
key.append("action", "true")
fetch("https://atlantich2h.com/deposit/instant", {
method: "POST",
body: key,
redirect: 'follow'
})
.then(responsee => responsee.json())
.then(res => {
console.log(res)
})
}
let kemii = new URLSearchParams()
kemii.append("api_key", atlaapi)
kemii.append("id", ress.data.id)
fetch("https://atlantich2h.com/deposit/status", {
method: "POST",
body: kemii,
redirect: 'follow'
})
.then(responsee => responsee.json())
.then(resss => {
if (resss.data.status === "success") {
let ss = '```Pembayaran Diterima, Succes Menambahkan Saldo Ke Akun Anda Sejumlah : ```' + `Rp ${toRupiah(resss.data.get_balance)}, -Rp ${toRupiah(resss.data.fee)}`
m.reply(ss)
} else if (resss.data.status === "error") {
let sa = '```Deposit dibatalkan!\nAlasan : ```' + `Terjadi Kesalahan Server!`
m.reply(sa)
}
})
})
}
break
}
}
handler.help = [
"atla-ff",
"atla-ml",
"atla-pubg",
"atla-genshin",
"atla-zepeto",
"atla-dana",
"atla-gopay",
"atla-ovo",
"atla-axis",
"atla-three",
"atla-tsel",
"atla-smartfrent",
"atla-order",
"atla-depo"
]
handler.command = /^(atla-dana|atla-ff|atla-gopay|atla-ovo|atla-ml|atla-order|atla-depo|atla-axis|atla-pubg|atla-genshin|atla-zepeto|atla-three|atla-tsel|atla-smartfrent)$/i  
handler.tags = ['atlantic']
handler.limit = false
handler.owner = false
module.exports = handler

function getRandomInt(min, max) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toRupiah(angka) {
var saldo = '';
var angkarev = angka.toString().split('').reverse().join('');
for (var i = 0; i < angkarev.length; i++)
if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
return '' + saldo.split('', saldo.length - 1).reverse().join('');
}