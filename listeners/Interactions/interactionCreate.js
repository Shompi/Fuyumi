const { default: axios } = require('axios');
const { Listener } = require('discord-akairo');
const { Interaction, MessageEmbed } = require('discord.js');
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
      if (interaction.isCommand()) {
        const slashCommand = interaction.client.commands.get(interaction.commandName);

        if (!slashCommand) return;

        interaction.client.emit('onCommandUsed', ({ commandName: interaction.commandName, user: interaction.user, subcommand: interaction.options.getSubcommand(false) }));
        await slashCommand.execute(interaction);

      }
      else if (interaction.isButton() && interaction.inCachedGuild()) {

        if (interaction.customId.startsWith('role-')) {
          return await ButtonAddRoles(interaction);
        }

        if (interaction.customId === 'showroles') {
          const member = await interaction.member.fetch();

          const roles = member.roles.cache.sort((a, b) => a.position - b.position).map(role => role.toString());

          const rolesEmbed = new MessageEmbed()
            .setTitle(`Estos son tus roles ${member.displayName}`)
            .setDescription(roles.join(" - "))
            .setFooter({ text: `Tienes un total de ${roles.length} roles`, iconURL: member.displayAvatarURL() })
            .setColor(member.displayColor);

          return await interaction.reply({ embeds: [rolesEmbed], ephemeral: true });
        }

      }
      else if (interaction.isContextMenu()) {
        const contextCommand = interaction.client.commands.get(interaction.commandName);

        if (!contextCommand) return;

        await contextCommand.execute(interaction);
      }
      else if (interaction.isAutocomplete()) {
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

      if (interaction.deferred) {
        await interaction.editReply({ content: "ocurrió un error con esta interacción" }).catch(console.error);
      } else {
        await interaction.reply({ content: 'Ocurrió un error con esta interacción.', ephemeral: true }).catch(console.error);
      }
    }
  }
}


module.exports = InteractionEvent;