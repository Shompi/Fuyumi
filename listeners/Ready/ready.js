const { Listener } = require('discord-akairo');
const MukiClient = require('../../Classes/MukiClient');
const UpdateButtons = require('./utils/Buttons');


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
        console.log("Timers limpiados.");
      }
    }

    this.setActivity = () => {
      timers.push(setInterval(() => {
        this.client.user.setActivity({ name: '💙 Reviviendo... de a poco...', type: 'PLAYING' });
      }, 10000));
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