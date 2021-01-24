const { Client } = require('discord.js');
const { basename } = require('path');
const fetch = require('node-fetch').default;

const activity = {
  name: "En cuarentena",
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

    // Enviar información a la API del foro.
    timers.push(setInterval(() => {
      // Por ahora solo serán las guilds que maneja Muki.

      const guilds = Muki.guilds.cache.map(guild => {

        return ({
          name: guild.name,
          icon: guild.iconURL({ size: 256 }),
          members: guild.memberCount,
          channels: guild.channels.cache.size,
          owner: {
            username: guild.owner.user.tag,
            avatarURL: guild.owner.user.displayAvatarURL({ size: 256 }),
            id: guild.owner.id
          }
        })
      });

      const payload = {
        client: {
          tag: Muki.user.tag,
          avatarURL: Muki.user.displayAvatarURL({ size: 512 }),
          cachedUsers: Muki.users.cache.size,
        },
        guilds: guilds
      }

      fetch("http://localhost:4000/muki/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        timeout: 2000
      }).then(response => response.json())
        .then(data => {
          console.log(data.message);
        })
        .catch(e => {
          console.log("Hubo un error al enviar la información a la API.");
        });

    }, 5000));
  }
}