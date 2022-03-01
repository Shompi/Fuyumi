const keyv = require('keyv');
const { Listener } = require('discord-akairo');
const lastPresence = new keyv("sqlite://presence.sqlite", { namespace: 'presence' });
const { saveGuilds } = require('./utils/saveGuilds');
const { Client } = require('discord.js');

// Models
const { getGuildModel } = require('../../Schemas/Guild');
const { getBirthdayModel } = require('../../Schemas/Birthdays');

// const UpdateButtons = require('./utils/Buttons');


/**@type {NodeJS.Timeout[]} */
const timers = [];

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    });
    this.hasTimers = true;
    this.clearTimers = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer);
        clearImmediate(timer);
        timers.shift();
      });
      console.log("Timers limpiados.");
    }

    this.setActivity = () => {
      timers.push(setInterval(async () => {
        let activity = await lastPresence.get('0') ?? '💙 Reviviendo... de a poco...';
        this.client.user.setActivity({ name: activity, type: 'PLAYING' });
      }, 20000));
    }
  }

  /** @param {Client} client */
  async exec(client) {
    /*Code Here*/
    console.log(`Online en Discord como: ${client.user.tag}`);
    console.log(`Bot listo: ${Date()}`);

    client.models = {
      GuildModel: await getGuildModel(),
      BirthdayModel: await getBirthdayModel()
    }

    this.setActivity();
    // console.log("Actualizando botones de roles...");
    // await UpdateButtons(client);

    console.log("Guardando guilds...");
    await saveGuilds(client.guilds.cache, client.models.GuildModel);
  }
}

module.exports = ReadyListener;