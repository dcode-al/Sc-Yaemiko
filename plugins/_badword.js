const fs = require('fs');
const path = require('path');
const badwordsPath = path.resolve(__dirname, '../media/badwords.json');

const getBadwords = () => JSON.parse(fs.readFileSync(badwordsPath));
const saveBadwords = (badwords) => fs.writeFileSync(badwordsPath, JSON.stringify(badwords, null, 2));

const addBadword = async (kata, m) => {
  let badwords = getBadwords();
  if (!badwords.includes(kata)) {
    badwords.push(kata);
    saveBadwords(badwords);
    m.reply(`Kata kasar "${kata}" berhasil ditambahkan.`);
  } else {
    m.reply(`Kata kasar "${kata}" sudah ada.`);
  }
};

const deleteBadword = async (kata, m) => {
  let badwords = getBadwords();
  if (badwords.includes(kata)) {
    badwords = badwords.filter(word => word !== kata);
    saveBadwords(badwords);
    m.reply(`Kata kasar "${kata}" berhasil dihapus.`);
  } else {
    m.reply(`Kata kasar "${kata}" tidak ditemukan.`);
  }
};

let handler = async (m, { command, args }) => {
  const kata = args.join(' ');
  if (command === 'addbadword') {
    await addBadword(kata, m);
  } else if (command === 'deletebadword') {
    await deleteBadword(kata, m);
  }
};

handler.command = /^addbadword|deletebadword$/i;
handler.help = ['addbadword', 'deletebadword'];
handler.tags = ['group'];

module.exports = handler;