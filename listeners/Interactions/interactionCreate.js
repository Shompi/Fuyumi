const { Listener } = require('discord-akairo');
const { Interaction } = require('discord.js');
const MukiClient = require('../../Classes/MukiClient');
const ButtonAddRoles = require('./Buttons/roles');
console.log("interaction module loaded");

class InteractionEvent extends Listener {
  constructor() {
    super('interactionCreate', {
      emitter: 'client',
      event: 'interactionCreate'
    });
  }

  /**@param {Interaction} interaction */
  async exec(interaction) {

    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);

      } catch (error) {
        console.error(error);
        await interaction.reply({ content: error, ephemeral: true });
      }
    }

    // Button handlers
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('role-')) {
        ButtonAddRoles(interaction);
      }
    }
  }
}


module.exports = InteractionEvent;