const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { BirthdayEdit } = require('./SubCommands/birthday-edit');
const { BirthdayRemove } = require('./SubCommands/birthday-remove');
const { BirthdaySet } = require('./SubCommands/birthday-set');

module.exports = {
  hasSubcommands: true,
  subcommands: ["birthday-edit.js", "birthday-remove.js", "birthday-set.js"],
  data: new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('Comandos relacionados con los cumpleaños')
    .addSubcommand(set => {
      return set.setName('set')
        .setDescription('Agrega tu fecha de cumpleaños')
        .addIntegerOption(month => {
          return month.setName('mes')
            .setDescription('El mes de tu cumpleaños')
            .addChoices([
              ["Enero", 0],
              ["Febrero", 1],
              ["Marzo", 2],
              ["Abril", 3],
              ["Mayo", 4],
              ["Junio", 5],
              ["Julio", 6],
              ["Agosto", 7],
              ["Septiembre", 8],
              ["Octubre", 9],
              ["Noviembre", 10],
              ["Diciembre", 11],
            ])
            .setRequired(true)
        })
        .addIntegerOption(day => {
          return day.setName("dia")
            .setDescription('El dia de tu cumpleaños (1 - 31)')
            .setMinValue(1)
            .setMaxValue(31)
            .setRequired(true)
        })
    })
    .addSubcommand(edit => {
      return edit.setName('editar')
        .setDescription("Edita tu fecha de cumpleaños")
        .addIntegerOption(month => {
          return month.setName('mes')
            .setDescription('El mes de tu cumpleaños')
            .addChoices([
              ["Enero", 0],
              ["Febrero", 1],
              ["Marzo", 2],
              ["Abril", 3],
              ["Mayo", 4],
              ["Junio", 5],
              ["Julio", 6],
              ["Agosto", 7],
              ["Septiembre", 8],
              ["Octubre", 9],
              ["Noviembre", 10],
              ["Diciembre", 11],
            ])
            .setRequired(true)
        })
        .addIntegerOption(day => {
          return day.setName("dia")
            .setDescription('El dia de tu cumpleaños (1 - 31)')
            .setMinValue(1)
            .setMaxValue(31)
            .setRequired(true)
        })
    })
    .addSubcommand(remove => {
      return remove.setName('quitar')
        .setDescription("Quita tu cumpleaños");
    }),
  isGlobal: false,
  /**
  * @param {CommandInteraction} interaction
  */
  async execute(interaction) {

    switch (interaction.options.getSubcommand()) {
      case 'set':
        await BirthdaySet(interaction);
        break;
      case 'editar':
        await BirthdayEdit(interaction);
        break;
      case 'quitar':
        await BirthdayRemove(interaction);
        break;
    }
  }
}