const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TimeoutMember } = require('./SubCommands/mod-timeout');
const { Announce } = require('./SubCommands/mod-announce');
const { ChannelType } = require('discord-api-types/v9');

module.exports = {
  hasSubcommands: true,
  subcommands: ["mod-timeout.js", "mod-announce.js"],
  data: new SlashCommandBuilder()
    .setName('moderacion')
    .setDescription('Comandos de moderación')

    // GuildMember timeout command
    .addSubcommand(timeout => {
      return timeout.setName('timeout')
        .setDescription('Silencia al usuario no permitiendole interactuar ni conectar a canales de voz.')
        .addUserOption(inputUser => {
          return inputUser.setName('miembro')
            .setDescription('El miembro al que quieres silenciar.')
            .setRequired(true)
        })
        .addIntegerOption(segundos => {
          return segundos.setName('segundos')
            .setDescription('Tiempo en segundos por el cual quieres silenciar a este miembro.')
            .setMinValue(5)
            .setRequired(false)
        })
        .addStringOption(reason => {
          return reason.setName('razon')
            .setDescription('La razón por la que silenciarás a este miembro.')
            .setRequired(false)
        })
    })

    // Announcement command
    .addSubcommand(announce => {
      return announce.setName('anuncio')
        .setDescription('Crea y envia un mensaje dentro de un embed a un canal de texto.')
        .addChannelOption(channel => {
          return channel.setName('canal')
            .setDescription('Canal al que quieres enviar este anuncio')
            .setRequired(true)
            .addChannelTypes([ChannelType.GuildText, ChannelType.GuildNews]);
        })
        .addStringOption(description => {
          return description.setName('descripcion')
            .setDescription('Una detallada descripción de tu anuncio, hasta 1500 caracteres.')
            .setRequired(true)
        })
        .addStringOption(titulo => {
          return titulo.setName('titulo')
            .setDescription('El titulo de este anuncio')
            .setRequired(false)
        })
        .addStringOption(color => {
          return color.setName('color')
            .setDescription('El color que quieres que tenga el embed (barra lateral izquierda)')
            .addChoices([
              ["Amarillo", "YELLOW"],
              ["Azul", "BLUE"],
              ["Blanco", "WHITE"],
              ["Dorado", "GOLD"],
              ["Fucsia", "FUCHSIA"],
              ["Morado", "PURPLE"],
              ["Naranja", "ORANGE"],
              ["Rojo", "RED"],
              ["Verde", "GREEN"],
              ["Verde Oscuro", "DARK_GREEN"],
              ["Random", "RANDOM"],
            ])
        })
        .addStringOption(imagen => {
          return imagen.setName('imagen')
            .setDescription('Si quieres adjuntar una imagen en el embedido, escribe la URL aqui')
            .setRequired(false)
        })
        .addStringOption(thumbnail => {
          return thumbnail.setName('miniatura')
            .setDescription('URL de la imagen miniatura del embed')
            .setRequired(false)
        })
        .addStringOption(footer => {
          return footer.setName('pie')
            .setDescription('El pié de página de este anuncio')
            .setRequired(false)
        })
        .addMentionableOption(mencion => {
          return mencion.setName('mencion1')
            .setDescription('Rol o Usuario que quieres mencionar')
            .setRequired(false)
        })
        .addMentionableOption(mencion => {
          return mencion.setName('mencion2')
            .setDescription('Rol o Usuario que quieres mencionar')
            .setRequired(false)
        })
        .addMentionableOption(mencion => {
          return mencion.setName('mencion3')
            .setDescription('Rol o Usuario que quieres mencionar')
            .setRequired(false)
        })
    }),
  isGlobal: true,
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {


    if (!interaction.inGuild()) return await interaction.reply({ content: 'No puedes usar esta interacción fuera de un servidor.' });

    // Check for moderation perms
    if (interaction.memberPermissions.any(['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MODERATE_MEMBERS'])) {

      const commandName = interaction.options.getSubcommand();

      switch (commandName) {
        case 'timeout':
          return await TimeoutMember(interaction);
        case 'anuncio':
          return await Announce(interaction);
      }

    } else {
      await interaction.reply({ content: 'No tienes los suficientes permisos para usar este comando. Necesitas al menos uno de los siguientes permisos: [Administrador, Expulsar Miembros, Prohibir Miembros, Moderar Miembros]', ephemeral: true });
    }
  }
}