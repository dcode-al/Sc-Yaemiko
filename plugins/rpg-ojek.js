let cewe = ['Farida','Santi','Ranti','Narti','Siti','Novi','Windi','Dewi'];
let umurcwe = ['17','18','35','90','60','30','16','20'];
let daricwe = ['pasar','sekolah','jepang','toko','warung','selingkuh','cowo','rumah'];
let tujuancwe = ['rumah','pasar','sekolah','kuliah','jajan','jalan','bo','mabok'];

let tarif = ['5000','6000','8000','9000','10000','500000','9000000'];

let cowo = ['Ikball','Indraa','Denis','Adit','Yanto','Ferdi','Sugiono','Adi','Wildan'];
let umurcwo = ['17','18','35','90','60','30','16','20'];
let daricwo = ['mabok','tawuran','basecamp','pangkalan','warung','bentrok','shlolat','masjid'];
let tujuancwo = ['rumah','main','warnet','kuliah','openbo','tawuran','bo','mabok'];

let orang = [{
    nama: pickRandom(cewe),
    umur: pickRandom(umurcwe),
    dari: pickRandom(daricwe),
    tujuan: pickRandom(tujuancwe),
    pp: 'https://telegra.ph/file/2261bed530acd0d05a953.jpg',   
    tarif: pickRandom(tarif),
    gender: 'Female'
}, {
    nama: pickRandom(cowo),
    umur: pickRandom(umurcwo),
    dari: pickRandom(daricwo),
    tujuan: pickRandom(tujuancwo),
    pp: 'https://telegra.ph/file/51ac2675943778bd34561.jpg',
    tarif: pickRandom(tarif),
    gender: 'Male'
}];

async function handler(m, { conn, args, text, usedPrefix, command }) {
    conn.ngojek = conn.ngojek ? conn.ngojek : {};
    let delay = time => new Promise(res => setTimeout(res, time));   
    let user = global.db.data.users[m.sender];
    
    if (user.job !== 'gojek') return m.reply('Hanya untuk user dengan job gojek');
    if (user.location !== 'Pangkalan') return m.reply('Kamu tidak berada di pangkalan, silahkan ketik *.pergi* untuk pergi ke pangkalan');
    
    await m.reply('Menunggu Orderan...');
    await delay(18000);
    let orderan = pickRandom(orang);
    let capt = 'Mendapatkan Orderan\n\n';
    capt += '```Nama:```' + ` ${orderan.nama}\n`;
    capt += '```Kelamin:```' + ` ${orderan.gender}\n`;
    capt += '```Umur:```' + ` ${orderan.umur}\n`;
    capt += '```Dari:```' + ` ${orderan.dari}\n`;
    capt += '```Tujuan:```' + ` ${orderan.tujuan}\n`;
    capt += '```Ongkos:```' + ` Rp ${Func.formatter(orderan.tarif)}\n\n`;
    capt += '> Jika ingin menerima orderan silahkan kirim *Yes*, atau kirim *No* untuk menolak orderan.';
    await conn.sendFile(m.chat, orderan.pp, '', capt.trim(), m);
    conn.ngojek[m.sender] = {
        ongkos: orderan.tarif,
        dari: orderan.dari,
        tujuan: orderan.tujuan,
        name: orderan.nama,
        kemii: conn
    };
}

handler.before = async m => {
    conn.ngojek = conn.ngojek ? conn.ngojek : {};
    if (!(m.sender in conn.ngojek)) return;
    let delay = time => new Promise(res => setTimeout(res, time));
    let { ongkos, kemii, name, dari, tujuan } = conn.ngojek[m.sender];

    if (m.text.toLowerCase() == 'yes') {
        let capt = `Sedang Mengantarkan ${name}\n\n`;
        capt += '```- From:```' + '```' + ` ${dari}` + '```\n';
        capt += '```- To:```' + '```' + ` ${tujuan}` + '```\n';
        capt += '```- Ongkos:```' + '```' + ` Rp ${Func.formatter(ongkos)}` + '```\n';
        capt += '```- Status: Pending```';
        let edit = await kemii.reply(m.chat, capt, m);
        await delay(18000);
        global.db.data.users[m.sender].money += Number(ongkos);
        let txt = `Berhasil Mengantarkan ${name}\n\n`;
        txt += '```- Ongkos:```' + '```' + ` Rp ${Func.formatter(ongkos)}\n` + '```\n';  
        txt += '```- Status: Success```\n\n';
        txt += '> Ongkos berhasil di tambahkan ke balance anda!';
        await kemii.sendMessage(m.chat, { text: txt, edit: edit });
        delete conn.ngojek[m.sender];
    } else if (m.text.toLowerCase() == 'no') {
        await m.reply('Berhasil menolak orderan..');
        delete conn.ngojek[m.sender];
    }
}

handler.help = ['ojek'];
handler.tags = ['rpg'];
handler.command = /^(ojek|ngojek|gojek|ojk)$/i;
handler.register = true;

module.exports = handler;

/**
 * Random pick from Array
 * @param {Array} list
 * @returns Any
 */
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}