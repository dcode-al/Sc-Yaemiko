class Alyachan {
   baseUrl = 'https://api.alyachan.dev/api/'
   apiKey = null

   constructor(apiKey) {
      this.apiKey = apiKey || ''
   }
   
   joox = async (text) => {
      let json = await Func.fetchJson(this.baseUrl + 'joox?' + 'q=' + text + '&apikey=' + this.apiKey)
      return json
   }
   
   musicapple = async (text) => {
      let json = await Func.fetchJson(this.baseUrl + 'music-apple?' + 'q=' + text + '&apikey=' + this.apiKey)
      return json
   }
   
   countystalk = async (text) => {
      let json = await Func.fetchJson(this.baseUrl + 'country?' + 'q=' + text + '&apikey' + this.apiKey)
      return json
   }
   
   voiceai = async (text, voice) => {
      let json = await Func.fetchJson(this.baseUrl + 'voice-ai?' + 'text=' + text + '&voice_over=' + voice + '&apikey=' + this.apiKey)
      return json
   }
   
   webclone = async (url) => {
      let json= await Func.fetchJson(this.baseUrl + 'web-cloner?' + 'url=' + url + '&apikey=' + this.apiKey)
      return json
   }
   
   bingimage = async (text) => {
      let json = await Func.fetchJson(this.baseUrl + 'bing-image?' + 'q=' + text + '&apikey=' + this.apiKey)
      return json
   }
   
   ewallet = async (type, text) => {
      let json = await Func.fetchJson(this.baseUrl + 'e-wallet?' + 'action=' + type + '&num=' + text + '&type=' + 'ewallet' + '&apikey=' + this.apiKey)
      return json
   }
   
   disney = async (url) => {
      let json = await Func.fetchJson(this.baseUrl + 'disney?' + 'image=' + url + '&apikey=' + this.apiKey)
      return json
   }
   
}

module.exports = { Alyachan }