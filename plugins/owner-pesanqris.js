const fetch = require("node-fetch")
const Baileys = require("@whiskeysockets/baileys")

let handler  = async (m, { conn }) => {

let prep = Baileys.generateWAMessageFromContent(m.chat, { orderMessage: {
  orderId: '947047533463142',
  thumbnail: await (await fetch('https://telegra.ph/file/57e15164f570eea228cfb.jpg')).buffer(),
  itemCount: 1,
  status: 1,
  surface: 1,
  message: '',
  orderTitle: '',
  sellerJid: '6285141316864@s.whatsapp.net',
  token: 'AR4aJYkn8lURKCqFauWA/HAJqSw1C5pWHtfUo8XG/nN9Eg==',
  priceAmount: '5000',
  totalAmount1000: '5000',
  totalCurrencyCode: 'IDR',
  contextInfo: null,
}}, { quoted: m })
 await conn.relayMessage(m.chat, prep.message,  {messageId: prep.key.id })
}

handler.command = /^pesanqris$/
handler.owner = true
module.exports = handler