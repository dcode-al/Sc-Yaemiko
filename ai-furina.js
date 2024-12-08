/*
   * By Indra Ganteng
   * Juli 15.05
   * follow more on Instagram: @indraa_frna
*/

const axios = require("axios");
const fetch = require("node-fetch");
const gis = require("g-i-s");
const { play } = require('../lib/syoutube');
const yts = require('yt-search');
const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const os = require('os');

const streamPipeline = promisify(pipeline);

let handler = async (m, { conn, text, usedPrefix, command, isBotAdmin, isAdmin }) => {
  try {
    let indraaa = pickRandom([
      "Kucing", "Tikus", "Kadal", "Kuda Nil", "Bunglon", "Siput", "Koala", "Kodok", "Monyet", "Anjing",
      "Harimau", "Kuda", "Komodo", "Gajah", "Cicak", "Ular", "Kura-kura", "Lele", "Singa", "Zebra",
      "Bebek", "Ayam", "Buaya", "Gorila", "Naga", "Ikan", "Ubur-ubur", "Cacing", "Semut", "Udang",
      "Musang", "Kecoak", "Kupu-kupu", "Laba-laba", "Elang", "Sapi", "Kambing", "Kelinci", "Belut",
      "Berang-berang", "Hiu", "Paus", "Lumba-lumba", "Burung Hantu", "Kakaktua", "Merpati", "Bebek",
      "Ayam Kalkun", "Kepiting", "Lobster", "Ular Piton", "Iguana", "Salamander", "Katak Pohon",
      "Burung Pelikan", "Burung Cendrawasih", "Rubah", "Serigala", "Beruang", "Babi Hutan", "Kijang",
      "Antelop", "Kudanil", "Jerapah", "Gajah Afrika", "Kanguru", "Koala", "Wombat", "Platipus",
      "Tarsius", "Orangutan", "Simba", "Mandril", "Gelada", "Gorila Gunung", "Panda", "Harimau Siberia",
      "Macan Tutul", "Cheetah", "Lynx", "Jaguar", "Ocelot", "Serval", "Kucing Hutan", "Karacal"
    ]);

    if (!text) {
      return m.reply(`Hallo *${m.name}* Aku Furina @6287861280225 Senang bertemu denganmu~ Apa yang ingin kamu ceritakan atau tanyakan hari ini? Aku diciptakan oleh @6285325268412 untuk mendengarkan dan membantu dengan apapun yang kamu butuhkan! ☺️`.trim());
    }

    if (text.includes("group") && text.includes("tutup")) {
      if (!isBotAdmin) return m.reply(`Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`);
      if (!isAdmin) return m.reply(`Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`);
      await conn.groupSettingUpdate(m.chat, "announcement");
      m.reply(`Oke, grup telah ditutup. Semoga lebih teratur ya~ 😉`);
    } else if (text.includes("group") && text.includes("buka")) {
      if (!isBotAdmin) return m.reply(`Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`);
      if (!isAdmin) return m.reply(`Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`);
      await conn.groupSettingUpdate(m.chat, "not_announcement");
      m.reply(`Oke, grup telah dibuka. Ayo kita beraktivitas bersama-sama! 😉`);
    } else if (text.includes("berhenti") || text.includes("berhentiin") || text.includes("demote")) {
      if (!isBotAdmin) return m.reply(`Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`);
      if (!isAdmin) return m.reply(`Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`);
      let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      await conn.groupParticipantsUpdate(m.chat, [users], 'demote');
      m.reply(`Maaf Ya Terpaksa Aku demote😙, Perintah Admin Sih..`);
    } else if (text.includes("cek") || text.includes("khodamku") || text.includes("cekkodam")) {
      let txt = `╭━━━━°「 *Ini adalah Khodam mu kak* 」°\n┃\n┊•nama: *@${m.quoted ? m.quoted.sender.split("@")[0] : m.sender.split("@")[0]}*\n┃•Khodam mu: *${indraaa}*\n╰═┅═━––––––๑\n> _Ini adalah khodam menurut furina kak_`;
      m.reply(txt);
    } else if (text.includes("adminin") || text.includes("tolong") || text.includes("promote")) {
      if (!isBotAdmin) return m.reply(`Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`);
      if (!isAdmin) return m.reply(`Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`);
      let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      await conn.groupParticipantsUpdate(m.chat, [users], 'promote');
      m.reply(`Horee kamu di promote admin nih!!😼.`);
    } else if (text.includes("carikan") || text.includes("putar") || text.includes("putarkan") || text.includes("golekno lagu") || text.includes("anu tolong carikan aku lagu") || text.includes("play")) {
      let anu = await m.reply('Sebentar furina cariin dulu yaa, semoga ada');
      
      try {
        // Pencarian video di YouTube
        let search = await yts(text);
        if (search.videos.length === 0) throw new Error('Tidak ditemukan video.');

        let vid = search.videos[0];
        let { title, url } = vid;

        // Menggunakan format baru untuk play
        const json = await play(url);
        
        // Validasi respons JSON
        if (!json || !json.data || !json.data.url) {
          throw new Error('Data tidak valid dari fungsi play.');
        }

        // Menyiapkan file
        let tmpDir = os.tmpdir();
        let filePath = `${tmpDir}/${title}.mp3`;
        let audioUrl = json.data.url;
        let audioBuffer = await fetchAudioBuffer(audioUrl);
        
        await writeFile(filePath, audioBuffer);

        // Kirim file audio tanpa caption
        let doc = {
          audio: {
            url: filePath
          },
          mimetype: 'audio/mp4',
          fileName: title,
        };
        await conn.sendMessage(m.chat, doc);
        await unlink(filePath);
      } catch (e) {
        await conn.sendMessage(m.chat, { text: e.message, edit: anu });
      }
    } else if (text.includes("kick") || text.includes("kik")) {
      if (!isBotAdmin) return m.reply(`Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`);
      if (!isAdmin) return m.reply(`Maaf, hanya admin yang bisa menggunakan perintah ini. 😔`);
      let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      await conn.groupParticipantsUpdate(m.chat, [users], "remove");
      m.reply(`Maaf Ya Terpaksa Aku Tendang 😖, Perintah Admin Sih..`);
    } else {
      let prompt = `Kamu adalah Furina @⁨Punyaku⁩, dan kamu adalah asisten cerdas dan sangat ramah buatan *@6285325268412 Indra*, selalu gunakan emoji saat memberi jawaban, ingat kamu orang yang ramah dan selalu ngasih nomor @6285325268412 itu adalah Indra si pencipta ku ingat harus di ingat`;
      let indraa = await fetch(`https://skizo.tech/api/openai?apikey=${global.xzn}&text=${text}&system=${prompt}`);
      let res = await indraa.json();
      m.reply(res.result);
    }
  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { text: "\nTerjadi kesalahan saat menerima permintaan anda, silahkan hubungi owner\n" });
  }
};

handler.help = ["furina"];
handler.tags = ["ai"];
handler.command = ["furina"];
handler.register = true
handler.premium = true;
module.exports = handler;

function trimYouTubeUrl(url) {
  const trimmedUrl = url.split("?")[0];
  return trimmedUrl;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

async function fetchAudioBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch audio: ${response.statusText}`);
  return response.buffer();
}

async function writeFile(filePath, buffer) {
  await fs.promises.writeFile(filePath, buffer);
}

async function unlink(filePath) {
  await fs.promises.unlink(filePath);
}