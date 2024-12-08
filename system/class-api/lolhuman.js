class LolhumanApi {
   baseUrl = 'https://api.lolhuman.xyz/api'
   apiKey = null

   constructor(apiKey) {
      this.apiKey = apiKey || ''
   }
   
   igdl = async (text) => {
      let json = await Func.fetchJson(this.baseUrl + '/instagram?' + 'apikey=' + this.apiKey + '&url=' + text)
      return json
   }
   
}

module.exports = { LolhumanApi }