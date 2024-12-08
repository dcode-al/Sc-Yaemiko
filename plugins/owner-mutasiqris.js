let fetch = require('node-fetch');

let handler = async (m, { conn }) => {
const apiUrl = `https://gateway.okeconnect.com/api/mutasi/qris/OK1156153/583791417108436561156153OKCT12F72A0DB3C753E2E4050A1D91DB735C`;
const requestOptions = {
method: 'GET',
redirect: 'follow'
};
const response = await fetch(apiUrl, requestOptions);
const result = await response.json();
const data = result.data;
let capt = '*Q R I S - M U T A S I*\n\n'
if (data.length === 0) {
capt += 'Tidak ada data mutasi.';
} else {
data.forEach(entry => {
capt += '```Tanggal:```' + ` ${entry.date}\n`
capt += '```Issuer:```' + ` ${entry.brand_name}\n`
capt += '```Nominal:```' + ` Rp ${toRupiah(entry.amount)}\n\n`
});
}
await conn.reply(m.chat, `${capt}ID-${Func.makeId(20)}`, m);
}

handler.tags = ['owner']
handler.command = handler.help = ['mutasi']
handler.owner = true
module.exports = handler

function toRupiah(angka) {
var saldo = '';
var angkarev = angka.toString().split('').reverse().join('');
for (var i = 0; i < angkarev.length; i++)
if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
return '' + saldo.split('', saldo.length - 1).reverse().join('');
}