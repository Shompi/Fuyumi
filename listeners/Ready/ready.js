const { Listener } = require('discord-akairo');
const MukiClient = require('../../Classes/MukiClient');
const UpdateButtons = require('./utils/Buttons');
const keyv = require('keyv');
const lastPresence = new keyv("sqlite://presence.sqlite", { namespace: 'presence' });

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
      for (const timer of timers) {
        clearTimeout(timer);
        clearInterval(timer);
        clearImmediate(timer);
        timers.shift();
        console.log("Timers limpiados.");
      }
    }

    this.setActivity = () => {
      timers.push(setInterval(async () => {
        let activity = await lastPresence.get('0') ?? '💙 Reviviendo... de a poco...';
        this.client.user.setActivity({ name: activity, type: 'PLAYING' });
      }, 20000));
    }
  }

  async exec() {
    /*Code Here*/
    /**@type {MukiClient} */
    const client = this.client;
    console.log(`Online en Discord como: ${client.user.tag}`);
    console.log(`Bot listo: ${Date()}`);


    this.setActivity();

    UpdateButtons(client);
  }
}

module.exports = ReadyListener;