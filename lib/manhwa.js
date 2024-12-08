const axios = require('axios') 
const cheerio = require('cheerio')
const CryptoJS = require('crypto-js') 
const { HttpProxyAgent } = require("http-proxy-agent");
const { HttpsProxyAgent } = require("https-proxy-agent");

async function get(url) {
const proxy = "http://a3bf0a880edc57ad4e95363fc46e9611d08bbaa9:js_render=true@proxy.zenrows.com:8001";
const httpAgent = new HttpProxyAgent(proxy);
const httpsAgent = new HttpsProxyAgent(proxy);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
return (await axios({
    url,
    httpAgent,
    httpsAgent,
    method: 'GET',
})).data
	}
	
async function search(query) {
	const html = await get("https://manhwadesu.cc/?s="+encodeURIComponent(query)) 
	const $ =cheerio.load(html) 
	let result = []
	$("div.bs > div.bsx").each((i, e) => {
		result.push({
			title: $(e).find(".tt").text().trim(), 
			img: $(e).find("a").children(".limit").children("img").attr("src"), 
			chapter: $(e).find(".epxs").text().trim(), 
			rating: $(e).find(".numscore").text(), 
			url: $(e).find("a").attr("href")
			}) 
		}) 
		
		return result
	}
	
async function view(url) {
	const html = await get(url) 
	const $ = cheerio.load(html) 
	let result = {
		title: $("h1.entry-title").text().trim(), 
		img: $(".thumb > img").attr("src"), 
		followed: $(".bmc").text().trim(), 
		rating: $(".num").text().trim() 
		}
	
	$(".imptdt").each((i, e) => {
		result[$(e).clone().children().remove().end().text().trim().split(" ").join("_").toLowerCase()] = $(e).find("i").text().trim() 
		}) 
		
		result.sinopsis = $(".entry-content.entry-content-single > p").text().trim() 
		
		result.chapter = []
		
		$(".clstyle > li").each((i, e) => {
			result.chapter.push({
				index: parseInt($(e).attr("data-num")), 
				header: $(e).find(".chapternum").text().trim(), 
				title: $(e).find(".chapternum").clone().children().remove().end().text().trim(), 
				description: $(e).find(".chapternum").children("i").text().replace("-", "").trim(), 
				date: $(e).find(".chapterdate").text().trim(), 
				downloadUrl: $(e).find("a.dload").attr("href"), 
				url: $(e).find("a").attr("href")
				}) 
			}) 
		
		result.terkait = []
		
		$("div.bs > div.bsx").each((i, e) => {
		result.terkait.push({
			title: $(e).find(".tt").text().trim(), 
			img: $(e).find("a").children(".limit").children("img").attr("src"), 
			chapter: $(e).find(".epxs").text().trim(), 
			rating: $(e).find(".numscore").text(), 
			url: $(e).find("a").attr("href")
			}) 
		}) 
		
		return result
	}
	
module.exports = { search, view }