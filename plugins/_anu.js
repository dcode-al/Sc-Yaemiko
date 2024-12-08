*Scrape Text To Image*



/*
//
// Dibuat oleh Kaze 
// https://github.com/KazeDevID
// https://whatsapp.com/channel/0029VaFNnRTHLHQR6G0fC01O
//
*/

const fetch = require("node-fetch")

async function text2img(prompt) {
  try {
    const url = await fetch("https://tti.photoleapapp.com/api/v1/generate?prompt=" + prompt)
    const data = await url.json()
    const res = {
      url: data.result_url
    }
    return res
  } catch (err) {
    const res = {
      message: String(err)
    }
    console.log(res)
    return res
  }
}
handler.command = /^anu/i
handler.premium = true
module.exports = handler