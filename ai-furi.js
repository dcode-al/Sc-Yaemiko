const { G4F } = require("g4f");
let Airi = new G4F();

let handler = async (m, { conn, text }) => {
    conn.furina = conn.furina ? conn.furina : {};

    
    if (!text) throw `*• Example:* .furi *[on/off]*`;

    if (text === "on") {
        conn.furina[m.sender] = {
            pesan: []
        };
        // kalian bisa ganti ini untuk tanda apakah sesi sudah aktif atau belum
        m.reply("Halo sensei! furina siap membantu sensei");
    } else if (text === "off") {
        delete conn.furina[m.sender];
        // ini kalau sudah selesai sesi nya di tutup
        m.reply("Senang sudah membantu sensei");
    }
};

handler.before = async (m, { conn }) => {
    conn.furina = conn.furina ? conn.furina : {};
    if (m.isBaileys && m.fromMe) return;
    if (!m.text) return;
    if (!conn.furina[m.sender]) return;

    // prefix untuk mulai dan selesai sesi
    if (
        m.text.startsWith(".") ||
        m.text.startsWith("#") ||
        m.text.startsWith("!") ||
        m.text.startsWith("/") ||
        m.text.startsWith("\\/")
    ) return;

    if (conn.furina[m.sender] && m.text) {
        let name = conn.getName(m.sender);
        const messages = [
            ...conn.furina[m.sender].pesan,
            `p`,
            m.text
        ];
        try {
      const options = [
    {model: "gpt-4"}
  ];
  // di sini saya pakai model karater furina, kalau kalian mau ganti tapi model asisten bisa ganti kata furina itu dengan
  // nama karakter yang kalian mau
  const messages = [
    { role: "system", content: "kamu adalah furina, Seorang murid dari sensei di Blue archive yang siap membantu sensei kapan pun! 🍄✨" },
    { role: "assistant", content: `Kamu adalah furina, murid dari sensei blue archive, jangan gunakan saya, aku, gua gunakan furina untuk memanggil dirimu, ekspresi kan sikap kamu mirip seroang murid dari blue archive yang ada di Shittim Chest yang bernama furina, jangan gunakan GPT 4 panggil dirimu dengan furina, Kamu berbicara dengan${m.name}panggil dengan sensei, saat berbicara dengannya gunakan emoji yang lucu, Pembuatmu dana nomer WhatsApp nya ini 6285325268412 namanya Indra `},
    { role: "user", content: m.text },
  ];
  // ini untuk adreplay 
  let res = await Airi.chatCompletion(messages, options);
  await  conn.sendMessage(m.chat, {
    // ini nama dari karakter utama
    text: "⬣───「 *furina* 」───⬣" + "\n\n" + res,
    contextInfo: {
      externalAdReply: {  
        // title di bagian gambar
        title: "furina-Blue Archive",
        body: '',
        // gambar karakter kalian
        thumbnailUrl:`https://telegra.ph/file/492877da688a99c4302f2.jpg`,
        sourceUrl: null,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
                conn.furina[m.sender].pesan = messages;
        } catch (e) {
            console.error("Kesalahan Dalam mengambil Data");
            throw "error";
        }
    }
};

// command untuk memulai/ mengakhiri sesi 

handler.command = /^(furi)$/i
handler.help = ["furi"];
handler.tags = ["ai"];
handler.limit = true;
handler.owner = true;
handler.group =- true

module.exports = handler;