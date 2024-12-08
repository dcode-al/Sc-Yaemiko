// Inisialisasi penyimpanan acara (contoh sederhana dengan objek)
const calendarEvents = {};

// Handler untuk menambah acara baru
let addEventHandler = async (m, {
    conn,
    text,
    args,
    usedPrefix,
    command
}) => {
    // Memisahkan pesan menjadi bagian-bagian yang dibutuhkan
    let params = text.split("|");
    
    // Validasi format pesan
    if (params.length !== 5) {
        throw `Format\n${usedPrefix}${command} nama_acara | tanggal | jam | bulan | tahun\nContoh: ${usedPrefix}${command} Ulang Tahun | 12 | 15 | 7 | 2024`;
    }

    // Menyiapkan informasi acara dari pesan
    let namaAcara = params[0].trim();
    let tanggal = parseInt(params[1].trim());
    let jam = parseInt(params[2].trim());
    let bulan = parseInt(params[3].trim());
    let tahun = parseInt(params[4].trim());

    // Validasi tanggal dan waktu
    if (isNaN(tanggal) || isNaN(jam) || isNaN(bulan) || isNaN(tahun)) {
        throw "Format tanggal, jam, bulan, atau tahun tidak valid.";
    }

    // Membuat obyek Date untuk waktu acara
    let date = new Date(tahun, bulan - 1, tanggal, jam);

    // Menyimpan acara ke dalam penyimpanan acara (dalam contoh ini, disimpan dalam objek)
    calendarEvents[namaAcara] = {
        date: date.toLocaleString()
    };

    // Mengirimkan pesan konfirmasi ke pengguna
    await conn.sendMessage(m.chat, `Acara "${namaAcara}" berhasil ditambahkan ke kalender pada ${date.toLocaleString()}`);
};

// Handler untuk mengedit acara
let editEventHandler = async (m, {
    conn,
    text,
    args,
    usedPrefix,
    command
}) => {
    // Memisahkan pesan menjadi bagian-bagian yang dibutuhkan
    let params = text.split("|");
    
    // Validasi format pesan
    if (params.length !== 6) {
        throw `Format\n${usedPrefix}${command} edit|nama_lama|nama_baru|tanggal|jam|bulan|tahun\nContoh: ${usedPrefix}${command} edit|Ulang Tahun|Pesta Ulang Tahun|12|15|7|2024`;
    }

    // Memisahkan parameter edit dari pesan
    let editParams = params[0].trim().toLowerCase().split(" ");
    let isEdit = editParams[0] === 'edit';
    if (!isEdit) {
        throw `Perintah tidak valid. Gunakan "${usedPrefix}${command} edit|nama_lama|nama_baru|tanggal|jam|bulan|tahun" untuk mengedit acara.`;
    }

    // Menyiapkan informasi acara dari pesan
    let oldEventName = editParams[1].trim();
    let newEventName = params[1].trim();
    let tanggal = parseInt(params[2].trim());
    let jam = parseInt(params[3].trim());
    let bulan = parseInt(params[4].trim());
    let tahun = parseInt(params[5].trim());

    // Validasi tanggal dan waktu
    if (isNaN(tanggal) || isNaN(jam) || isNaN(bulan) || isNaN(tahun)) {
        throw "Format tanggal, jam, bulan, atau tahun tidak valid.";
    }

    // Membuat obyek Date untuk waktu acara
    let date = new Date(tahun, bulan - 1, tanggal, jam);

    // Mengubah acara yang sudah ada jika ditemukan
    if (calendarEvents[oldEventName]) {
        calendarEvents[oldEventName] = {
            date: date.toLocaleString()
        };
        await conn.sendMessage(m.chat, `Acara "${oldEventName}" berhasil diubah menjadi "${newEventName}" pada ${date.toLocaleString()}`);
    } else {
        throw `Acara "${oldEventName}" tidak ditemukan.`;
    }
};

// Registrasi handler ke bot
addEventHandler.command = /^addcalendar$/i;
editEventHandler.command = /^editcalendar$/i;

module.exports = {
    addEventHandler,
    editEventHandler
};