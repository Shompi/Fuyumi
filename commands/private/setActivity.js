const { Command } = require('discord-akairo');
const keyv = require('keyv');
const lastPresence = new keyv("sqlite://presence.sqlite", { namespace: 'presence' })

class SetActivityCommand extends Command {
  constructor() {
    super('activity', {
      aliases: ['activity', 'setactivity'],
      description: 'Comando para cambiarle el nombre de la actividad al bot',
      ownerOnly: true,
      args: [{ type: "string", id: "activity" }]
    });
  }

  async exec(message, { activity }) {

    await lastPresence.set('0', activity);

    return await message.reply({ content: `La actividad **${activity}** se ha guardado con éxito.` });
  }
}

module.exports = SetActivityCommand;