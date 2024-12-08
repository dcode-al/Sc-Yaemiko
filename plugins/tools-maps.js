// By Indra Gantebg
// https://whatsapp.com/channel/0029VaYVlVP9hXF9Ig83hJ3L
// No delete My wm
// 5 Juli 21.09

let fetch = require('node-fetch');

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `*Example:* ${usedPrefix + command} Jakarta`;

  try {
    await m.reply('Please wait...');
    
    // Fetch data dari Nominatim OpenStreetMap untuk mendapatkan koordinat berdasarkan nama kota
    let res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=1`).then(result => result.json());
    if (res.length === 0) throw `City ${text} not found!`;

    let location = res[0];
    let city = location.display_name;
    let latitude = location.lat;
    let longitude = location.lon;

    let locationInfo = `City: ${city}\nLatitude: ${latitude}\nLongitude: ${longitude}`;

    // Mengirim lokasi ke chat
    await conn.sendMessage(m.chat, { location: { degreesLatitude: parseFloat(latitude), degreesLongitude: parseFloat(longitude) } }, { ephemeralExpiration: 604800 });

    // Delay 2 detik sebelum mengirim informasi tambahan
    await delay(2000);
    conn.reply(m.chat, locationInfo, m);
    
  } catch (e) { 
    throw { error: `City ${text} not found!` };
  }
}

handler.command = handler.help = ['map', 'maps'];
handler.tags = ['tools'];
handler.premium = false;
module.exports = handler;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}