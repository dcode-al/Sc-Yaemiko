let cron = require("node-cron");
let { proto, generateWAMessageFromContent, prepareWAMessageMedia } = require("@whiskeysockets/baileys")
let handler = (m) => m;
let messageSent = false;

handler.before = async function (m) {
  cron.schedule(
    "00 00 * * *",
    () => {
      let users = global.db.data.users;

      let resetUsers = Object.entries(users).filter(
        ([user, data]) => data.limit < 10,
      );

      if (resetUsers.length > 0 && !messageSent) {
        let limit = 150;

        resetUsers.forEach(([user, data]) => {
          data.limit = limit;
        });
        console.log("Reset Limit");

        try {
          let messages = {
              extendedTextMessage: {
                  text: 'Successfully reset user limit to 150'
              }
          };
        
          let messageToChannel = proto.Message.encode(messages).finish();

          let result = {
              tag: 'message',
              attrs: { to: '120363299719848392@newsletter', type: 'text' },
              content: [
                  {
                      tag: 'plaintext',
                      attrs: {},
                      content: messageToChannel
                  }
              ]
          };

          conn.query(result);
        } catch (error) {
          console.error("Error in sendSaluran:", error);
          throw error;
        }
        messageSent = true;
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Jakarta",
    },
  );
};

module.exports = handler;