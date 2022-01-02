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

    console.log("Nueva actividad:", activity);
    console.log("Guardando actividad en base de datos...")
    await lastPresence.set('0', activity);
    console.log("Actividad guardada.")

    return await message.reply({ content: `La actividad **${activity}** se ha guardado con éxito.` });
  }
}

module.exports = SetActivityCommand;