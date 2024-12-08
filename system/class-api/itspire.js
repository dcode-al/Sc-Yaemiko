class Itzpire {
   baseUrl = 'https://itzpire.site'
   apiKey = null

   constructor(apiKey) {
      this.apiKey = apiKey || ''
   }
   
   emi = async (text) => {
      let json = await Func.fetchJson(this.baseUrl + '/ai/' + 'emi?' + 'prompt=' + text)
      return json
   }
   
   gemini = async (text) => {
      let json = await Func.fetchJson(this.baseUrl + '/ai/' + 'gemini-ai?' + 'q=' + text)
      return json
   }
   
   geminiimage = async (text, url) => {
      let json = await Func.fetchJson(this.baseUrl + '/ai/' + 'gemini-ai?' + 'q=' + text + '&url=' + url)
      return json
   }
   
   aiimage = async (text) => {
      let json = await Func.fetchJson(this.baseUrl + '/ai/' + 'gpt-pict?' + 'q=' + text)
      return json
   }
   
   gptweb = async (text) => {
      let json = await Func.fetchJson(this.baseUrl + '/ai/' + 'gpt-web?' + 'q=' + text)
      return json
   }
   
   pixartlcm = async (styles, text) => {
      let json = await Func.fetchJson(this.baseUrl + '/ai/' + 'pixart-lcm?' + 'image_style=' + styles + '&prompt=' + text)
      return json
   }
   
   pixelart = async (text) => {
      let json = await Func.fetchJson(this.baseUrl + '/ai/' + 'pixelart?' + 'prompt=' + text)
      return json
   }
   
   pixart = async (styles, url) => {
      let json = await Func.fetchJson(this.baseUrl + '/tools/' + 'photo2pixart?' + 'url=' + url + '&model=' + styles)
      return json
   }
   
   tridmodel = async (text) => {
      let json = await Func.fetchJson(`https://itzpire.site/ai/3dmodel?prompt=${text}`)
      return json
   }
   
   dallemini = async (text) => {
      let json = await Func.fetchJson(`https://itzpire.site/ai/dalle-mini?prompt=${text}`)
      return json
   }
   
   gptpict = async (text) => {
      let json = await Func.fetchJson(`https://itzpire.site/ai/gpt-pict?q=${text}`)
      return json
   }
}

module.exports = { Itzpire }