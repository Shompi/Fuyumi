const { Client } = require('discord.js');
const { basename } = require('path');

const activity = {
  name: "Version 5.0 (Testing)!",
  type: "PLAYING"
}


/**@type {NodeJS.Timeout[]} */
const timers = [];
console.log("Evento ready iniciado.");
console.log("timers: " + timers.length);
module.exports = {
  name: "ready",
  filename: basename(__filename),
  path: __filename,
  hasTimers: true,
  clearTimers() {
    for (const timer of timers) {
      clearTimeout(timer);
      clearInterval(timer);
      clearImmediate(timer);
    }
  },
  /**
  *@param {Client} Muki
  */
  async execute(Muki) {
    /*Code Here*/
    console.log(`Online en Discord como: ${Muki.user.tag}`);

    try {
      await Muki.user.setPresence({ activity: activity });
      console.log(`Bot listo: ${Date()}`);
    } catch (error) {
      console.log(error);
      Muki.emit("error", error);
    }

    timers.push(setInterval(() => {
      Muki.user.setPresence({ activity: activity }).catch(() => console.log("Error setting the presence"));
    }, 1000 * 60 * 30));

  }
}