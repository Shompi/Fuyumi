const { Listener } = require('discord-akairo');
const { Interaction, EmbedBuilder, InteractionType } = require('discord.js');
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
      // Chat input command
      if (interaction.isChatInputCommand()) {
        const slashCommand = interaction.client.commands.get(interaction.commandName);

        if (!slashCommand) return await interaction.reply({ content: 'Este comando no está implementado.', ephemeral: true });

        interaction.client.emit('commandUsed', ({ commandName: interaction.commandName, user: interaction.user, subcommand: interaction.options.getSubcommand(false) }));
        await slashCommand.execute(interaction);

      }
      // Button interaction
      else if (interaction.isButton() && interaction.inCachedGuild()) {

        if (interaction.customId.startsWith('role-')) {
          return await ButtonAddRoles(interaction);

        } else if (interaction.customId === 'showroles') {
          const member = await interaction.member.fetch();

          const roles = member.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());

          const rolesEmbed = new EmbedBuilder()
            .setTitle(`Estos son tus roles ${member.displayName} (Desde el más alto al mas bajo)`)
            .setDescription(roles.join(" - "))
            .setFooter({ text: `Tienes un total de ${roles.length} roles`, iconURL: member.displayAvatarURL() })
            .setColor(member.displayColor);

          return await interaction.reply({ embeds: [rolesEmbed], ephemeral: true });
        }

      }
      // Context menu interactions
      else if (interaction.isContextMenuCommand()) {
        const contextCommand = interaction.client.commands.get(interaction.commandName);

        if (!contextCommand) return;

        await contextCommand.execute(interaction);
      }
    } catch (error) {
      console.error(error);
    }
  }
}


module.exports = InteractionEvent;