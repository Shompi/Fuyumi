//@ts-check
const keyv = require('keyv');
const { Listener } = require('discord-akairo');
const lastPresence = new keyv("sqlite://presence.sqlite", { namespace: 'presence' });
const { Client, Activity, ActivityType } = require('discord.js');
const { EarthquakeMonitor } = require('./utils/earthquakes');


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
        // @ts-ignore
        timers.shift();
      });
      console.log("Timers limpiados.");
    }

    this.setActivity = () => {
      timers.push(setInterval(async () => {
        /** @type {Activity} */
        let activity = await lastPresence.get('0') ?? { name: '💙 Reviviendo... de a poco...', type: ActivityType.Playing };
        // @ts-ignore
        this.client.user?.setActivity(activity);
      }, 60000));
    }

    this.earthquakeMonitor = () => {
      console.log("Monitoring earthquakes...");
      timers.push(setInterval(async () => {
        EarthquakeMonitor(this.client)
      }, 1000 * 60 * 3))
    }
  }

  /** @param {Client} client */
  async exec(client) {
    /*Code Here*/
    console.log(`Online en Discord como: ${client.user?.tag}`);
    console.log(`Bot listo: ${Date()}`);

    this.setActivity();
    this.earthquakeMonitor();
    console.log("Startup complete!");
    client.emit("deployServer", client);
  }
}

module.exports = ReadyListener;