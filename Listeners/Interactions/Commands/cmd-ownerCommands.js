const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Test } = require('./SubCommands/owner-test');
const { Activity } = require('./SubCommands/owner-activity');
const { Host } = require('./SubCommands/owner-host');

module.exports = {
  hasSubcommands: true,
  subcommands: ["owner-activity.js", "owner-host.js", "owner-test.js"],
  data: new SlashCommandBuilder()
    .setName('owner')
    .setDescription('Comandos para configurar el comportamiento del bot (owner only)')
    .setDefaultPermission(false)
    // Test command
    .addSubcommand(test => test.setName('test').setDescription('Evalúa código Javascript')
      .addStringOption(input => input.setName('input').setDescription('input a probar.')))
    // Activity command
    .addSubcommand(activity => activity.setName('actividad').setDescription('Cambia la actividad del bot')
      .addStringOption(nombre => nombre.setName('nombre').setDescription('Nombre de la actividad').setRequired(true))
      .addStringOption(type => type.setName('tipo')
        .setDescription('El tipo de actividad')
        .addChoices(
          { name: "Playing", value: "PLAYING" },
          { name: "Watching", value: "WATCHING" },
          { name: "Listening", value: "LISTENING" },
        )))
    // Host command
    .addSubcommand(host => host.setName('host').setDescription('Hostea a un usuario que esté transmitiendo en Twitch / Youtube')
      .addUserOption(user => user.setName('usuario').setDescription('El usuario que está en vivo'))
      .addStringOption(url => url.setName('url').setDescription('URL del stream'))
      .addStringOption(titulo => titulo.setName('titulo').setDescription('Titulo del stream, en caso de que se ingrese una URL'))),
  isGlobal: false,

  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {

    const subcommand = interaction.options.getSubcommand();


    switch (subcommand) {
      case 'test':
        Test(interaction);
        break;
      case 'actividad':
        Activity(interaction);
        break;
      case 'host':
        Host(interaction);
        break;
    }

  }
}