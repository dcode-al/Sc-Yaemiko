class SkyzoTech {
   baseUrl = 'https://skizo.tech/api'
   apiKey = null

   constructor(apiKey) {
      this.apiKey = apiKey || ''
   }
   
   wpsearch = async (text) => {
      let json = await Func.fetchJson(this.baseUrl + '/wpsearch?' + 'apikey=' + this.apiKey + '&search=' + text)
      return json
   }
   
   musicsearch = async (text) => {
      let json = await Func.fetchJson(this.baseUrl + '/musicsearch?' + 'apikey=' + this.apiKey + '&search=' + text)
      return json
   }
   
   dalle3 = async (text) => {
     let json = await Func.fetchJson(this.baseUrl + '/dalle3?' + 'apikey=' + this.apiKey + '&prompt=' + text)
     return json
   }
}

module.exports = { SkyzoTech }