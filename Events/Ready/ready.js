const { Client, TextChannel } = require('discord.js');
const { basename } = require('path');
const fetch = require('node-fetch').default;

let fetchMemes = true;




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
    timers.push(setInterval(sendInfoToAPI, 5000, Muki));
    timers.push(setInterval(sendMemeToAPI, 60000, Muki));
  }
}

/**@param {Client} client */
const sendInfoToAPI = async (client) => {

  console.log(client.user.tag);

  const guilds = client.guilds.cache.map(guild => {

    return ({
      name: guild.name,
      icon: guild.iconURL({ size: 256 }),
      members: guild.memberCount,
      channels: guild.channels.cache.size,
      owner: {
        tag: guild.owner.user.tag,
        avatarURL: guild.owner.user.displayAvatarURL({ size: 256 }),
      }
    })
  });

  const payload = {
    client: {
      tag: client.user.tag,
      avatarURL: client.user.displayAvatarURL({ size: 512 }),
      cachedUsers: client.users.cache.size,
      cachedChannels: client.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0),
    },
    guilds: guilds
  }

  const response = await fetch("http://localhost:4000/muki/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload),
    timeout: 2000
  }).catch(e => null);


  if (!response) return;

  const data = await response.json();
  console.log(data.message);
}

/**@param {Client} client */
const sendMemeToAPI = async (client) => {

  /**@type {TextChannel} */
  const memesChannel = client.channels.cache.get("622889689472303120");

  if (fetchMemes)
    await memesChannel.messages.fetch({ limit: 50 }, true, true);


  const lastMemes = memesChannel.messages.cache.filter(message => message.attachments.size >= 1);

  if (lastMemes.size === 0)
    return; // No hay memes :(

  const memes = lastMemes.map(message => {
    return {
      author: {
        tag: message.author.tag,
        avatarURL: message.author.displayAvatarURL({ size: 512 })
      },
      imageURL: message.attachments.first().url
    }
  });

  const response = await fetch("http://localhost:4000/exiliados/memes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(memes),
    timeout: 2000
  }).catch(e => null);

  if (!response) return;

  const data = await response.json();
  console.log(data.message);

}