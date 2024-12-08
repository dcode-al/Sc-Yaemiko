let { NeoxrApi } = require('../system/class-api/neoxr.js')
let { Itzpire } = require('../system/class-api/itspire.js')
let { LolhumanApi } = require('../system/class-api/lolhuman.js')
let { SkyzoTech } = require('../system/class-api/skyzotech.js')
let { Alyachan } = require('../system/class-api/alyachan.js')

let handler = m => m;
handler.all = async function (m) {
global.itz = new Itzpire('-') // Itzpire Api
global.neo = new NeoxrApi('ceyung') // Neoxr Api
global.lol = new LolhumanApi('GataDios') // Lolhuman Api
global.skyzo = new SkyzoTech('Kemii') // Skyzo Tech Api
global.alya = new Alyachan('dcodekemii') // Alya Chan Api
}

module.exports = handler;