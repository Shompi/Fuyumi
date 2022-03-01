const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { FifaPlayer, FifaTeam } = require('./SubCommands/fifa');

module.exports = {
  hasSubcommands: true,
  subcommands: ["fifa.js"],
  data: new SlashCommandBuilder()
    .setName('fifa')
    .setDescription('Comandos de fifa')
    .addSubcommand(teamSubcommand => {
      return teamSubcommand.setName('equipo')
        .setDescription('Información del Pro Club Exiliados')
    })
    .addSubcommand(playerSubcommand => {
      return playerSubcommand.setName('jugador')
        .setDescription('Estadísticas de un jugador del club')
        .addStringOption(jugador => {
          return jugador.setName('pro_name')
            .setDescription('Nombre del jugador')
            .setAutocomplete(true)
            .setRequired(true)
        })
    }),
  isGlobal: false,
  /**
  * @param {CommandInteraction} interaction
  */
  async execute(interaction) {

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'equipo':
        return await FifaTeam(interaction);
      case 'jugador':
        return await FifaPlayer(interaction);
    }
  }
}