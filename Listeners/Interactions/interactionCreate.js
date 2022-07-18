const { default: axios } = require('axios');
const { Listener } = require('discord-akairo');
const { Interaction, EmbedBuilder, InteractionType } = require('discord.js');
const ButtonAddRoles = require('./Buttons/roles');

/** @type {[{name: string, gamesPlayed: string, goals: string, assists: string, manOfTheMatch: string, ratingAve: string, favoritePosition: string}] | null} */

let fifaRooster = null;

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

        if (!slashCommand) return;

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
      // Autocomplete interactions
      else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        if (interaction.commandName === 'fifa' && interaction.options.getSubcommand() === 'jugador') {
          if (!fifaRooster) {
            fifaRooster = await axios.get('https://proclubs.ea.com/api/fifa/members/career/stats?platform=pc&clubId=559503').then(response => response.data.members);
          } else {
            const focusedValue = interaction.options.getFocused();
            return await interaction.respond(fifaRooster.filter(player => player.name.toLowerCase().includes(focusedValue.toLowerCase())).map(member => ({ name: member.name, value: member.name })));
          }
        }
      }

    } catch (error) {
      console.error(error);
    }
  }
}


module.exports = InteractionEvent;