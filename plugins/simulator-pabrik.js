let handler = async (m, {
args,
text,
conn,
usedPrefix,
command,
}) => {
	let id = m.sender;
	let data = global.db.data.users[m.sender].simulator
	let _db = db.data.users;
	
let type = (args[0] || '').toLowerCase()

const harga = {
emas: 800,
mobil: 10000,
perhiasan: 15000,
}

switch (type) {
case 'beli': case 'buy':
if (!data[id]) throw 'Kamu belum login ❎'

if (data[id].login == undefined) throw 'Kamu belum login jadi kamu ga bisa beli sesuatu ❎'

let kurang
if (args[1] == 'emas') {
if (!args[2]) return m.reply(`mau beli berapa gram kak😃\n*/pabrik beli emas 20*\n\n20 itu menunjukkan jumlah gram`)
kurang = (args[2] * harga.emas)
if (kurang > _db[id].money) return m.reply(`uang kamu kurang untuk membeli ${args[1]} seberat ${args[2]} gram`)

_db[id].money -= kurang
data[id].emas_mu += args[2]
m.reply('🛒 kamu telah berhasil membeli ' + args[1])

} else if (args[1] == 'mobil'){

if (!args[2]) return m.reply(`mau beli berapa kak😃\n*/pabrik beli mobil 1*`)
kurang = (args[2] * harga.mobil)
if (kurang > _db[id].money) return m.reply(`uang kamu kurang untuk membeli ${args[2]} ${args[1]}`)
if (data[id].emas_mu > 1) return m.reply('kamu tidak mempunyai emas😅\nnbeli dengan cara */pabrik beli emas 20\n20 itu beratnya gram*')

_db[id].money -= kurang
data[id].mobil_mu += args[2]
m.reply('🛒 kamu telah berhasil membeli ' + args[1])

} else if (args[1] == 'perhiasan') {

if (!args[2]) return m.reply(`mau beli berapa kak😃\n*/pabrik beli perhiasan 2*`)
kurang = (args[2] * harga.perhiasan)
if (kurang > _db[id].money) return m.reply(`uang kamu kurang untuk membeli ${args[2]} ${args[1]}\nharga 1 perhiasan`)
_db[id].money -= kurang
data[id].perhiasan_mu += args[2]
m.reply('🛒 kamu telah berhasil membeli ' + args[1])
}
break
default:
m.reply(`*Barang yang tersedia*
cara pembelian: */pabrik beli mobil 1*

*Produk pabrik*
1. emas
2. mobil
3. perhiasan

*simulator v1.0 (beta)*`)
}
}
handler.help = handler.command = ['pabrik']
handler.tags = ['simulator']

module.exports = handler

function kurangBerapa(nilai1, nilai2) {
  return Math.abs(nilai1 - nilai2);
}