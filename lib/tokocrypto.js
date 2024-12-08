const axios = require('axios')

class Tokocrypto {
   constructor() {
      this.headers = {
         headers: {
            device: 4,
            deviceno: '5abd943af1e0a682d351db0cc4e8ef4f',
            referer: 'https://www.tokocrypto.com/markets',
            'x-trace-id': '651a9bdf-34da-4a94-936c-b73e374a0532',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36'
         }
      }
   }

   currency = pair => new Promise(async resolve => {
      try {
         const json = await (await axios.get('https://www.tokocrypto.com/v1/market/currency-rates', this.headers)).data
         if (!json.data || json.data.length < 1) return resolve({
            creator: 'dcodekemii',
            status: false,
            msg: `Can't get metadata!`
         })
         if (pair) {
            var result = json.data.find(v => v.pair === pair.toUpperCase())
            if (!result) return resolve({
               creator: 'dcodekemii',
               status: false,
               msg: `Currency not found!`
            })
            resolve({
               creator: 'dcodekemii',
               status: true,
               data: result
            })
         } else {
            resolve({
               creator: 'dcodekemii',
               status: true,
               data: json.data
            })
         }
      } catch (e) {
         resolve({
            creator: 'dcodekemii',
            status: false,
            msg: e.message
         })
      }
   })

   assets = asset => new Promise(async resolve => {
      try {
         const json = await (await axios.get('https://www.tokocrypto.com/v1/market/quote-assets', this.headers)).data
         if (!json.data || json.data.list.length < 1) return resolve({
            creator: 'dcodekemii',
            status: false,
            msg: `Can't get metadata!`
         })
         if (asset) {
            var result = json.data.list.find(v => v.asset === asset.toUpperCase())
            if (!result) return resolve({
               creator: 'dcodekemii',
               status: false,
               msg: `Quote asset not found!`
            })
            resolve({
               creator: 'dcodekemii',
               status: true,
               data: result
            })
         } else {
            resolve({
               creator: 'dcodekemii',
               status: true,
               data: json.data.list
            })
         }
      } catch (e) {
         resolve({
            creator: 'dcodekemii',
            status: false,
            msg: e.message
         })
      }
   })

   recommendAssets = asset => new Promise(async resolve => {
      try {
         const json = await (await axios.get('https://www.tokocrypto.com/v1/market/recommend-assets', this.headers)).data
         if (!json.data || json.data.list.length < 1) return resolve({
            creator: 'dcodekemii',
            status: false,
            msg: `Can't get metadata!`
         })
         if (asset) {
            var result = json.data.list.find(v => v.symbol === asset.toUpperCase())
            if (!result) return resolve({
               creator: 'dcodekemii',
               status: false,
               msg: `Recommend quote asset not found!`
            })
            resolve({
               creator: 'dcodekemii',
               status: true,
               data: result
            })
         } else {
            resolve({
               creator: 'dcodekemii',
               status: true,
               data: json.data.list
            })
         }
      } catch (e) {
         resolve({
            creator: 'dcodekemii',
            status: false,
            msg: e.message
         })
      }
   })
}
module.exports = {
  Tokocrypto,
}