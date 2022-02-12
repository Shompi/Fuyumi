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

        interaction.client.emit('onCommandUsed', ({ commandName: interaction.commandName, user: interaction.user, subcommand: interaction.options.getSubcommand(false) }));
        await slashCommand.execute(interaction);

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

      if (interaction.deferred) {
        await interaction.editReply({ content: "ocurrió un error con esta interacción" }).catch(console.error);
      } else {
        await interaction.reply({ content: 'Ocurrió un error con esta interacción.', ephemeral: true }).catch(console.error);
      }
    }
  }
}


module.exports = InteractionEvent;