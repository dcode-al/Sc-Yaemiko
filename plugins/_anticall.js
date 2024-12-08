const { WAMessageStubType } = require('@whiskeysockets/baileys');

async function before(m) {
  this.ev.on('call', async (call) => {
    if (call[0].status === 'offer' && global.db.data.settings[this.user.jid].anticall) {
      const from = call[0].from;

      await this.sendMessage(from, {
        text: "Kamu di-banned + diblokir + diberi peringatan + dikeluarkan oleh bot karena melanggar aturan bot.\n\n*Dilarang menelepon bot!*",
        quoted: call[0]
      });

      await this.rejectCall(call[0].id, from);
      await this.updateBlockStatus(from, "block");

      console.log(`User ${from} blocked for calling.`);
    }
  });
  
  return true;
}

module.exports = {
  before
};