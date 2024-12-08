let NeoApi = require("@neoxr/wb");
let b = new NeoApi();
let fs = require('fs');
let fetch = require('node-fetch');
let { Tokocrypto } = require('../lib/tokocrypto.js')
let moment = require('moment-timezone');

let handler = m => m;
handler.all = async function (m) {
    let nama = await conn.getName(m.sender);
    let user = global.db.data.users[m.sender];
    let pp = global.thumb;
    try {
        pp = await this.profilePictureUrl(m.sender, 'image');
    } catch (e) {
    } finally {
        global.doc = pickRandom(["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/pdf"]);
        global.betul = 'https://telegra.ph/file/fa190f428461465d70837.png'
        global.salah = 'https://telegra.ph/file/ff4e3037f2df79041daff.png'       
        global.mpoint = `${getRandomInt(10,50)}${getRandomInt(100, 900)}`
        global.Button = require('../lib/button.js')
        global.tts = `- `
        global.pont = ` Point`
        global.tm = `*${tts}`+`${toRupiah(mpoint)}`+`${pont}*`
        global.dpoint = `${getRandomInt(50,500)}${getRandomInt(100, 900)}`
        global.tta = `+ `
        global.users = global.db.data.users[m.sender]
        global.sock = global.conn
        global.client = global.conn
        global.pontt = ` Point`
        global.ta = `*${tta}`+`${toRupiah(dpoint)}`+`${pontt}*`
        global.name = `${user.name}`
        global.idgc = '120363285122182348@g.us'    
        global.upload = require('../lib/uploadImage.js')
        global.uploader = require("../lib/uploader")
        global.footer = `${global.footer}`
        global.startTime = new Date();
        global.kripto = new Tokocrypto
        global.ucap = ucapan()         
        global.saweria = 'c3b34c02-c9b6-4990-b806-4e25dbdb34e6'
        global.Scraper = {
           Indra: require("../lib/scrape/ai.js"),
        }
       
        global.Func = b.Function;
        global.cd = Func.texted('bold','❌ Coldown Tunggu Beberapa saat lagi.')
        global.err = Func.texted('bold','❌ Terjadi kesalahan tunggu beberapa saat lagi.')
        global.cid = `ID-${Func.makeId(32)}`
        global.ucapan = ucapan()
        global.axios = require('axios')
        global.cheerio = require('cheerio')
        global.fetch = require('node-fetch')
        global.fs = require('fs')
        global.util = require('util')

        const _uptime = process.uptime() * 1000;
        global.fig = {
          contextInfo: {
          externalAdReply: {
          showAdAttribution: true,
          title: 'INDRAA',
          body: ucapan,
          thumbnailUrl: pp
          }
          } 
          }        
        global.fverif = {
          key: { 
          participant: '0@s.whatsapp.net', 
          remoteJid: "0@s.whatsapp.net" }, 
          message: {
          conversation: "_Furina Terverifikasi Oleh WhatsApp_"}
          }
        global.finvite = {"key":{"remoteJid":"0@s.whatsapp.net",
        "fromMe":false,
        "id":"D11A4D7ED7DD9D4C5180480A6CC323AC"},
        "message":{
        "newsletterAdminInviteMessage":{
        "newsletterJid":"120363290835103806@newsletter",
        "newsletterName":"Furina",
        "caption":"Powered By Furina","inviteExpiration":"1721259822"}}}
        global.fkon = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) }, message: { contactMessage: { displayName: name, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:Indraa\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}}
        
    }
};

module.exports = handler;

function toRupiah(angka) {
var saldo = '';
var angkarev = angka.toString().split('').reverse().join('');
for (var i = 0; i < angkarev.length; i++)
if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
return '' + saldo.split('', saldo.length - 1).reverse().join('');
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH');
    let res = "Malam";
    if (time >= 4) {
        res = "Pagi";
    }
    if (time > 10) {
        res = "Siang";
    }
    if (time >= 15) {
        res = "Sore";
    }
    if (time >= 18) {
        res = "Malam";
    }
    return res;
    }

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())];
}