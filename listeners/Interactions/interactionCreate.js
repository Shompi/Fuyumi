console.log("interaction module loaded");
const { Listener } = require('discord-akairo');
const { Interaction } = require('discord.js');
const { ContextMenuHandler } = require('./ContextMenu/main');
const ButtonAddRoles = require('./Buttons/roles');

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
        await interaction.reply({ content: "ocurrió un error con esta interacción", ephemeral: true });
      }

    } else if (interaction.isButton()) {
      if (interaction.customId.startsWith('role-')) {
        ButtonAddRoles(interaction);
      }

    } else if (interaction.isContextMenu()) {
      ContextMenuHandler(interaction);
    }
  }
}


module.exports = InteractionEvent;