let { Saweria } = require("../lib/saweria.js");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*• Example :* ${usedPrefix + command} *[email,password]*`;
  let [username, password] = text.split(",");
  
  try {
    let sawer = new Saweria();
    let hasil = await sawer.login(username, password);
    
    // Check if the response contains the expected data
    if (hasil.data && hasil.data.user_id) {
      db.data.saweria = hasil.data.user_id;
      m.reply(`Success Login to Saweria : *[ ${hasil.data.user_id} ]*`);
    } else {
      throw 'Login failed: User ID not found in the response.';
    }
  } catch (e) {
    throw `Error: ${e.message || e}`;
  }
};

handler.help = ["login"].map((a) => a + " *[Login to Saweria]*");
handler.tags = ["store"];
handler.command = ["login"];
handler.owner = true;

module.exports = handler;