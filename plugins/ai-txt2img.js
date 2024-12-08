const fetch = require('node-fetch');

const text2imgv1 = async (conn, m, text) => {
  try {
    conn.reply(m.chat, wait, m)
    const res = await fetch(`https://widipe.com/ai/text2img?text=${encodeURIComponent(text)}`);
    if (!res.ok) throw "Gagal mengambil gambar dari API";
    const imageBuffer = await res.buffer();
    conn.sendFile(m.chat, imageBuffer, 'image.jpg', `Result: ${text}`, m);
  } catch (error) {
    m.reply(`Error: ${error}`);
  }
};

const text2imgv2 = async (conn, m, text) => {
  try {
    conn.reply(m.chat, wait, m)
    const res = await fetch(`https://widipe.com/v2/text2img?text=${encodeURIComponent(text)}`);
    if (!res.ok) throw "Gagal mengambil gambar dari API";
    const imageBuffer = await res.buffer();
    conn.sendFile(m.chat, imageBuffer, 'image.jpg', `Result: ${text}`, m);
  } catch (error) {
    m.reply(`Error: ${error}`);
  }
};

const text2imgv3 = async (conn, m, text) => {
  try {
    conn.reply(m.chat, wait, m)
    const res = await fetch(`https://widipe.com/v3/text2img?text=${encodeURIComponent(text)}`);
    if (!res.ok) throw "Gagal mengambil gambar dari API";
    const imageBuffer = await res.buffer();
    conn.sendFile(m.chat, imageBuffer, 'image.jpg', `Result: ${text}`, m);
  } catch (error) {
    m.reply(`Error: ${error}`);
  }
};

const text2imgv4 = async (conn, m, text) => {
  try {
    conn.reply(m.chat, wait, m)
    const res = await fetch(`https://widipe.com/v4/text2img?text=${encodeURIComponent(text)}`);
    if (!res.ok) throw "Gagal mengambil gambar dari API";
    const imageBuffer = await res.buffer();
    conn.sendFile(m.chat, imageBuffer, 'image.jpg', `Result: ${text}`, m);
  } catch (error) {
    m.reply(`Error: ${error}`);
  }
};

const text2imgv5 = async (conn, m, text) => {
  try {
    conn.reply(m.chat, wait, m)
    const res = await fetch(`https://widipe.com/v5/text2img?text=${encodeURIComponent(text)}`);
    if (!res.ok) throw "Gagal mengambil gambar dari API";
    const imageBuffer = await res.buffer();
    conn.sendFile(m.chat, imageBuffer, 'image.jpg', `Result: ${text}`, m);
  } catch (error) {
    m.reply(`Error: ${error}`);
  }
};

const text2imgv6 = async (conn, m, text) => {
  try {
    conn.reply(m.chat, wait, m)
    const res = await fetch(`https://widipe.com/v6/text2img?text=${encodeURIComponent(text)}`);
    if (!res.ok) throw "Gagal mengambil gambar dari API";
    const imageBuffer = await res.buffer();
    conn.sendFile(m.chat, imageBuffer, 'image.jpg', `Result: ${text}`, m);
  } catch (error) {
    m.reply(`Error: ${error}`);
  }
};

const text2imgv7 = async (conn, m, text) => {
  try {
    conn.reply(m.chat, wait, m)
    const res = await fetch(`https://api.betabotz.eu.org/api/maker/text2img?text=${encodeURIComponent(text)}&apikey=${lann}`);
    if (!res.ok) throw "Gagal mengambil gambar dari API";
    const imageBuffer = await res.buffer();
    conn.sendFile(m.chat, imageBuffer, 'image.jpg', `Result: ${text}`, m);
  } catch (error) {
    m.reply(`Error: ${error}`);
  }
};

const handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `🚩 *Masukan detail gambar!* `;
  try {
    switch (command) {
      case 'text2imgv1':
        await text2imgv1(conn, m, text);
        break;
      case 'text2imgv2':
        await text2imgv2(conn, m, text);
        break;
      case 'text2imgv3':
        await text2imgv3(conn, m, text);
        break;
      case 'text2imgv4':
        await text2imgv4(conn, m, text);
        break;
      case 'text2imgv5':
        await text2imgv5(conn, m, text);
        break;
      case 'text2imgv6':
        await text2imgv6(conn, m, text);
        break;
      case 'text2imgv7':
        await text2imgv7(conn, m, text);
        break;
    }
  } catch (error) {
    m.reply(`Error: ${error}`);
  }
};

handler.command = handler.help = ['text2imgv1', 'text2imgv2', 'text2imgv3', 'text2imgv4', 'text2imgv5', 'text2imgv6', 'text2imgv7'];
handler.tags = ['ai'];
handler.limit = true;
module.exports = handler;