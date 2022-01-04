const { Listener } = require('discord-akairo');
const { Interaction } = require('discord.js');
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


    try {
      if (interaction.isCommand()) {
        const slashCommand = interaction.client.commands.get(interaction.commandName);

        if (!slashCommand) return;

        await slashCommand.execute(interaction);
        interaction.client.emit('onCommand', ({ commandName: interaction.commandName, user: interaction.user }));

      } else if (interaction.isButton()) {

        if (interaction.customId.startsWith('role-')) {
          ButtonAddRoles(interaction);
        }

      } else if (interaction.isContextMenu()) {
        const contextCommand = interaction.client.contextCommands.get(interaction.commandName);

        if (!contextCommand) return;

        await contextCommand.execute(interaction);
      }

    } catch (error) {
      console.error(error);

      if (interaction.isApplicationCommand() && interaction.deferred) {
        await interaction.editReply({ content: "ocurrió un error con esta interacción" });
      } else {
        interaction.reply({ content: 'Ocurrió un error con esta interacción.', ephemeral: true });
      }
    }
  }
}


module.exports = InteractionEvent;