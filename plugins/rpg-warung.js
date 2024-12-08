const { createCanvas, loadImage } = require('canvas');

let handler = async (m, { conn, text }) => {
    let user = global.db.data.users[m.sender];
    
    // Cek apakah user memiliki uang untuk membeli makanan
    if (user.money < 50) {
        return conn.reply(m.chat, 'Uang kamu tidak cukup untuk membeli makanan di warung.', m);
    }
    
    // List menu makanan beserta harganya
    let foodMenu = {
        '1': { name: 'Nasi Goreng', price: 15000, img: 'https://example.com/nasi_goreng.jpg' },
        '2': { name: 'Mie Ayam', price: 12000, img: 'https://example.com/mie_ayam.jpg' },
        '3': { name: 'Gado-gado', price: 10000, img: 'https://example.com/gado_gado.jpg' },
        '4': { name: 'Soto Ayam', price: 13000, img: 'https://example.com/soto_ayam.jpg' },
        '5': { name: 'Pecel Lele', price: 12000, img: 'https://example.com/pecel_lele.jpg' },
        '6': { name: 'Bakso', price: 10000, img: 'https://example.com/bakso.jpg' },
        '7': { name: 'Rendang', price: 20000, img: 'https://example.com/rendang.jpg' },
        '8': { name: 'Ayam Bakar', price: 18000, img: 'https://example.com/ayam_bakar.jpg' },
        '9': { name: 'Nasi Campur', price: 15000, img: 'https://example.com/nasi_campur.jpg' },
        '10': { name: 'Sate Ayam', price: 15000, img: 'https://example.com/sate_ayam.jpg' },
        '11': { name: 'Soto Betawi', price: 14000, img: 'https://example.com/soto_betawi.jpg' },
        '12': { name: 'Nasi Uduk', price: 12000, img: 'https://example.com/nasi_uduk.jpg' },
        '13': { name: 'Martabak', price: 20000, img: 'https://example.com/martabak.jpg' },
        '14': { name: 'Gudeg', price: 15000, img: 'https://example.com/gudeg.jpg' },
        '15': { name: 'Pempek', price: 13000, img: 'https://example.com/pempek.jpg' },
        '16': { name: 'Sop Buntut', price: 18000, img: 'https://example.com/sop_buntut.jpg' },
        '17': { name: 'Sate Padang', price: 17000, img: 'https://example.com/sate_padang.jpg' },
        '18': { name: 'Rawon', price: 16000, img: 'https://example.com/rawon.jpg' },
        '19': { name: 'Ketoprak', price: 14000, img: 'https://example.com/ketoprak.jpg' },
        '20': { name: 'Lontong Sayur', price: 12000, img: 'https://example.com/lontong_sayur.jpg' },
        '21': { name: 'Nasi Kuning', price: 15000, img: 'https://example.com/nasi_kuning.jpg' },
        '22': { name: 'Soto Madura', price: 13000, img: 'https://example.com/soto_madura.jpg' },
        '23': { name: 'Rujak', price: 10000, img: 'https://example.com/rujak.jpg' },
        '24': { name: 'Sambalado', price: 5000, img: 'https://example.com/sambalado.jpg' },
        '25': { name: 'Sambal Terasi', price: 5000, img: 'https://example.com/sambal_terasi.jpg' },
        '26': { name: 'Sambal Matah', price: 6000, img: 'https://example.com/sambal_matah.jpg' },
    };
    
    // List menu minuman beserta harganya
    let drinkMenu = {
        '27': { name: 'Es Sirup Manis', price: 5500, img: 'https://example.com/es_teh_manis.jpg' },
        '28': { name: 'Es Teh Manis', price: 5000, img: 'https://example.com/es_teh_manis.jpg' },
        '29': { name: 'Es Jeruk', price: 6000, img: 'https://example.com/es_jeruk.jpg' },
       '30': { name: 'Es Campur', price: 6500, img: 'https://example.com/es_teh_manis.jpg' }
    };
    
    // Fungsi untuk menambahkan padding
    const pad = (str, length) => str.padEnd(length, ' ');
    
    // Menampilkan menu makanan
    let foodText = '*List Menu Makanan*\n\n';
    for (let key in foodMenu) {
        foodText += `${pad(key + '.', 3)} ${pad(foodMenu[key].name, 15)} - ${foodMenu[key].price} Money\n`;
    }
    
    // Menampilkan menu minuman
    let drinkText = '*List Menu Minuman*\n\n';
    for (let key in drinkMenu) {
        drinkText += `${pad(key + '.', 3)} ${pad(drinkMenu[key].name, 15)} - ${drinkMenu[key].price} Money\n`;
    }
    
    // Kirim menu makanan atau minuman ke user jika tidak ada input
    if (!text) {
        conn.sendMessage(m.chat, {
            text: foodText + '\n' + drinkText + '\n\n*Cara Penggunaan:* ketik `warung <nomor>` untuk membeli makanan atau minuman.',
            contextInfo: {
                externalAdReply: {
                    title: 'List Menu Warung',
                    body: namebot,
                    thumbnailUrl: 'https://telegra.ph/file/d9cf812d980e54a4e5f6f.jpg',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });
        return;
    }
    
    // Memproses pilihan makanan atau minuman dari user
    let choice = text.trim();
    let food = foodMenu[choice];
    let drink = drinkMenu[choice];
    
    // Cek apakah pilihan makanan atau minuman valid
    if (!food && !drink) {
        conn.sendMessage(m.chat, {
            text: foodText + '\n' + drinkText + '\n\n*Cara Penggunaan:* ketik `warung <nomor>` untuk membeli makanan atau minuman.',
            contextInfo: {
                externalAdReply: {
                    title: 'List Menu Warung',
                    body: namebot,
                    thumbnailUrl: 'https://telegra.ph/file/d9cf812d980e54a4e5f6f.jpg',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });
        return;
    }
    
    // Cek apakah user memiliki cukup uang untuk membeli makanan atau minuman tersebut
    let selectedItem = food ? food : drink;
    if (user.money < selectedItem.price) {
        return conn.reply(m.chat, 'Uang kamu tidak cukup untuk membeli ini.', m);
    }
    
    // Proses transaksi pembelian makanan atau minuman
    user.money -= selectedItem.price;
    
    // Beri user pengalaman setiap kali membeli makanan atau minuman
    user.exp += Math.floor(selectedItem.price / 1000);
    
    // Kirim pesan ke user bahwa transaksi berhasil
    conn.reply(m.chat, `Kamu telah membeli ${selectedItem.name} seharga ${selectedItem.price} Money.`, m);
    
    // Simpan perubahan data user ke dalam database
    global.db.data.users[m.sender] = user;
};

handler.help = ['warung <nomor>'];
handler.tags = ['rpg'];
handler.command = /^(warung)$/i;

module.exports = handler;