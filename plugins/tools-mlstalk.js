const axios = require ('axios')



const handler = async (m, { conn, args }) => {
if(!args[0]) return m.reply('masukan id dan zone nya\n> Contoh: .stalkml 1393323764 15748')
const { server, negara, nama, dibuat_pada } = await mlbbChecker(args[0], args[1])
let tek = `*[ Mobile legends stalk ]*\n\n`
tek += `> *\`Nama:\`* ${nama}\n`
tek += `> *\`Server:\`* ${server}\n`
tek += `> *\`Negara Login:\`* ${negara}\n`
tek += `> *\`Akun Dibuat Pada:\`* ${await formatTanggal(dibuat_pada)}`
await m.reply(tek)

}
handler.command = ['stalkml', 'mlstalk']
handler.tags = ['tools', 'internet']
handler.help = ['stalkml']
handler.limit = true
handler.error = true
module exports = handler;

function formatTanggal(tanggal) {
const tanggalObj = new Date(tanggal);
const hari = tanggalObj.toLocaleString('id-ID', { weekday: 'long' });
const tanggalBulan = tanggalObj.getDate();
const bulan = tanggalObj.toLocaleString('id-ID', { month: 'long' });
const tahun = tanggalObj.getFullYear();
const jam = tanggalObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
return `${hari}, ${tanggalBulan} ${bulan} ${tahun} ${jam}`;
}

async function mlbbChecker(uid, zoneId) {
  const url = 'https://ml-validator.vercel.app/api/validate';
  const requestData = {
    userId: uid,
    zoneId: zoneId
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      const data = response.data;

      return {
        "server": data.createRoleCountry,
        "negara": data.thisLoginCountry,
        "nama": data.username,
        "dibuat_pada": data.userRegTime
      };
    } else {
      throw new Error(`Request failed with status code: ${response.status}`);
    }
  } catch (error) {
    return null;
  }
}