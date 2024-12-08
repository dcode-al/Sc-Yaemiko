const axios = require('axios')
const cheerio = require('cheerio')

class Utils {
   isUrl = url => {
      try {
         new URL(url)
         return true
      } catch {
         return false
      }
   }
   
   delay = time => new Promise(res => setTimeout(res, time))
}

module.exports = class Pikwy extends Utils {
   constructor() {
      super()
      this.baseUrl = 'https://pikwy.com'
      this.apiUrl = 'https://api.pikwy.com'
      this.headers = {
         'Accept': 'application/json, text/plain, */*',
         'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
         'Cache-Control': 'no-cache',
         'Connection': 'Keep-Alive',
         'Origin': this.baseUrl,
         'Pragma': 'no-cache',
         'Referer': this.baseUrl + '/',
         'Referrer-Policy': 'strict-origin-when-cross-origin',
         'User-Agent': 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
         'X-Requested-With': 'XMLHttpRequest',
         'X-Forwarded-For': Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.')
      }
      this.resolution = [{
         id: '1',
         name: 'QVGA',
         dimension: {
            width: '320',
            height: '240'
         }
      }, {
         id: '2',
         name: 'VGA',
         dimension: {
            width: '640',
            height: '480'
         }
      }, {
         id: '3',
         name: 'SVGA',
         dimension: {
            width: '800',
            height: '600'
         }
      }, {
         id: '4',
         name: 'HD',
         dimension: {
            width: '1280',
            height: '720'
         }
      }, {
         id: '5',
         name: 'SXGA',
         dimension: {
            width: '1280',
            height: '1024'
         }
      }, {
         id: '6',
         name: 'HD+',
         dimension: {
            width: '1600',
            height: '900'
         }
      }, {
         id: '7',
         name: 'FHD',
         dimension: {
            width: '1920',
            height: '1080'
         }
      }, {
         id: '8',
         name: '2K',
         dimension: {
            width: '2048',
            height: '1080'
         }
      }, {
         id: '9',
         name: '4K UHD',
         dimension: {
            width: '3840',
            height: '2160'
         }
      }, {
         id: '10',
         name: 'Galaxy S7/S7edge/S6',
         dimension: {
            width: '360',
            height: 'y S7/S7edge/S6)'
         }
      }, {
         id: '11',
         name: 'Galaxy S8/S8+/Note8/S9',
         dimension: {
            width: '360',
            height: 'y S8/S8+/Note8/S9)'
         }
      }, {
         id: '12',
         name: 'Galaxy S10',
         dimension: {
            width: '360',
            height: 'y S10)'
         }
      }, {
         id: '13',
         name: 'Google Pixel, Pixel 2',
         dimension: {
            width: '411',
            height: 'el 2)'
         }
      }, {
         id: '14',
         name: 'Google Glass',
         dimension: {
            width: '427',
            height: '240'
         }
      }, {
         id: '15',
         name: 'Kindle Fire',
         dimension: {
            width: '800',
            height: '1280'
         }
      }, {
         id: '16',
         name: 'iPhone X, XS',
         dimension: {
            width: '375',
            height: '812'
         }
      }, {
         id: '17',
         name: 'iPhone 6+, 6s+, 7+, 8+',
         dimension: {
            width: '414',
            height: '736'
         }
      }, {
         id: '18',
         name: 'iPhone XR, iPhone XS Max',
         dimension: {
            width: '414',
            height: ')'
         }
      }, {
         id: '19',
         name: 'iPad 3, 4, Air, Air2, Pro 9.7',
         dimension: {
            width: '768',
            height: '1024'
         }
      }, {
         id: '20',
         name: 'iPad Pro 12.9',
         dimension: {
            width: '1024',
            height: '1366'
         }
      }]
   }

   getAllresolution = () => new Promise(async resolve => {
      try {
         const html = await (await axios.get(this.baseUrl, {
            headers: this.headers
         })).data
         const $ = cheerio.load(html)
         let data = []
         $('select[aria-label="Resolution"]').find('option').each((i, e) => data.push({
            id: String(i + 1),
            name: $(e).text().match(/[(](.*?)[)]/)[1].trim(),
            dimension: {
               width: $(e).text().split('x').shift().trim(),
               height: $(e).text().split('x').pop().split('(').shift().trim()
            }
         }))
         if (data.length < 1) return resolve({
            creator: "Furina - Indraa Code",
            status: false,
            msg: 'No resolution found'
         })
         resolve({
            creator: "Furina - Indraa Code",
            status: true,
            data
         })
      } catch (e) {
         resolve({
            creator: "Furina - Indraa Code",
            status: false,
            msg: e.message
         })
      }
   })

   getToken = () => new Promise(async resolve => {
      try {
         const parse = await axios.get(this.baseUrl, {
            headers: this.headers
         })
         const $ = cheerio.load(parse.data)
         const cookie = parse.headers['set-cookie'].join('; ')
         const token = parse.data.match(/data\.tkn='(\d+)'/)[1]
         const d = parse.data.match(/data\.d=(\d+)/)[1]
         resolve([token, cookie, d])
      } catch (e) {
         resolve(null)
      }
   })

   generate = (url, resolution = 5, format = 'jpg', fullsize = false) => new Promise(async resolve => {
      try {
         if (!this.isUrl(url)) return resolve({
            creator: "Furina - Indraa Code",
            status: false,
            msg: 'Invalid url'
         })
         if (isNaN(resolution)) return resolve({
            creator: "Furina - Indraa Code",
            status: false,
            msg: 'Invalid resolution'
         })
         const fn = this.resolution.find(e => e.id == String(resolution))
         if (!fn) return resolve({
            creator: "Furina - Indraa Code",
            status: false,
            msg: 'Resolution not found'
         })
         const [token, cookie, d] = await this.getToken()
         const params = new URLSearchParams({
            tkn: token,
            d: d,
            u: encodeURIComponent(url),
            fs: fullsize ? 1 : 0,
            w: fn.dimension.width,
            h: fn.dimension.height,
            s: 100,
            z: 100,
            format: format,
            rt: 'jweb'
         })
         const json = await (await axios.get(`${this.apiUrl}/?${params.toString()}`, {
            headers: {
               ...this.headers,
               'Cookie': cookie
            }
         })).data
         if (!json.ourl) return resolve({
            creator: "Furina - Indraa Code",
            status: false,
            msg: 'Error, something went wrong!'
         })
         resolve({
            creator: "Furina - Indraa Code",
            status: true,
            data: {
               date: json.date,
               gambar: json.iurl,  // Mengubah dari iurl menjadi gambar
               ourl: json.ourl,
               device: fn
            }
         })
      } catch (e) {
         resolve({
            creator: "Furina - Indraa Code",
            status: false,
            msg: e.message
         })
      }
   })
   
   screenshot = (url, resolution = 5, format = 'jpg', fullsize = false) => new Promise(async resolve => {
      let i = 0
      while(true) {
         i++
         var json = await this.generate(url, resolution, format, fullsize)
         if (json.status) break
         if (i >= 7) break
         await this.delay(1200)
      }
      resolve(json)
   })
}