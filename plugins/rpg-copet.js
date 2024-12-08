let handler = async (m, { 
conn,
usedPrefix
}) => {
    let user = global.db.data.users[m.sender]
    let __timers = (new Date - user.lastcopet)
    let _timers = (10800000 - __timers)
    let timers = clockString(_timers) 
    
    if (user.stamina < 20) return m.reply(`Stamina anda tidak cukup untuk bekerja\nharap isi stamina anda dengan ${usedPrefix}eat`)
    if (user.lastcopet > 10800000) throw m.reply(`Kamu masih kelelahan untuk bekerja\nHarap tunggu ${timers} lagi untuk mencopet`)

let rndm1 = `${Math.floor(Math.random() * 10)}`
let rndm2 = `${Math.floor(Math.random() * 10)}`
.trim()

let ran1 = (rndm1 * 1000)
let ran2 = (rndm2 * 10) 

let hmsil1 = `${ran1}`
let hmsil2 = `${ran2}`

let jln = `
🚶         🚕

✔️ Mengincar target....
`

let jln2 = `
🚶     🚶

➕ Memulai aksi....
`

let jln3 = `
🚶

➕ Merampok....
`

let jln4 = `
         🚕
         
         
         
🚶

➕ 💹Berhasil kabur....
`

let hsl = `
*—[ Hasil rob ]—*

 ➕ 💹 Uang = [ ${hmsil1} ]
 ➕ ✨ Exp = [ ${hmsil2} ] 		 
 ➕ 📦 Copet Selesai = +1

Dan stamina anda berkurang -20
`
user.money += ran1
user.exp += ran2
user.stamina -= 20
	
setTimeout(() => {
                     m.reply(`${hsl}`)
                     }, 27000) 
               
                     setTimeout(() => {
                     m.reply(`${jln4}`)
                      }, 25000)
                
                     setTimeout(() => {
                     m.reply(`${jln3}`)
                     }, 20000) 
                        
                     setTimeout(() => {
                     m.reply(`${jln2}`)
                     }, 15000) 
                    
                     setTimeout(() => {
                     m.reply(`${jln}`)
                     }, 10000) 
                     
                     setTimeout(() => {
                     m.reply(`🔍Mencari orang.....`)
                     }, 0) 
  user.lastrob = new Date * 1
}
handler.help = ['copet']
handler.tags = ['rpg']
handler.command = /^(copet)$/i
handler.group = true
handler.rpg = true
module.exports = handler

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return ['\n' + d, ' *Days ☀️*\n ', h, ' *Hours 🕐*\n ', m, ' *Minute ⏰*\n ', s, ' *Second ⏱️* '].map(v => v.toString().padStart(2, 0)).join('')
}