const { CommandInteraction, SlashCommandBuilder, ChannelType } = require('discord.js');

/* Comandos */
const { TimeoutMember } = require('./SubCommands/mod-timeout');
const { Poll } = require('./SubCommands/mod-poll');
const { Announce } = require('./SubCommands/mod-announce');
const { ChangeVoiceRegion } = require('./SubCommands/mod-voiceRegion');


module.exports = {
  hasSubcommands: true,
  subcommands: ["mod-timeout.js", "mod-announce.js", "mod-poll.js", "mod-voiceRegion.js"],
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
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildNews);
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
            .addChoices(
              { name: "Amarillo", value: "YELLOW" },
              { name: "Azul", value: "BLUE" },
              { name: "Blanco", value: "WHITE" },
              { name: "Dorado", value: "GOLD" },
              { name: "Fucsia", value: "FUCHSIA" },
              { name: "Morado", value: "PURPLE" },
              { name: "Naranja", value: "ORANGE" },
              { name: "Rojo", value: "RED" },
              { name: "Verde", value: "GREEN" },
              { name: "Verde Oscuro", value: "DARK_GREEN" },
              { name: "Random", value: "RANDOM" },
            )
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
    })

    // Poll Command
    .addSubcommand(input => input.setName('encuesta')
      .setDescription('Comando para realizar encuestas en un canal.')
      .addStringOption(title => title.setName('titulo').setDescription('El título de ésta encuesta'))
      .addStringOption(description => description.setName('descripcion').setDescription('La descripción de esta encuesta'))
      .addChannelOption(channel => channel.setName('canal').setDescription('El canal en donde quieres enviar la encuesta. (def: El canal donde usas el comando)').addChannelTypes(ChannelType.GuildText))
      .addStringOption(option1 => option1.setName('opcion_1').setDescription("Opcion de la encuesta"))
      .addStringOption(option2 => option2.setName('opcion_2').setDescription("Opcion de la encuesta"))
      .addStringOption(option3 => option3.setName('opcion_3').setDescription("Opcion de la encuesta"))
      .addStringOption(option4 => option4.setName('opcion_4').setDescription("Opcion de la encuesta"))
      .addStringOption(option5 => option5.setName('opcion_5').setDescription("Opcion de la encuesta"))
      .addIntegerOption(tiempo => tiempo.setName('duracion').setDescription('La duración de esta encuesta en minutos. (def: 5 minutos)')))

    // Voice Region command
    .addSubcommand(command => command.setName("region-de-voz").setDescription("Cambia la región de voz del canal en el que estás")
      .addStringOption(region => region.setName('region').setDescription("La región a la que quieres cambiar el canal")
        .setRequired(false)
        .addChoices(
          { name: "Brazil", value: "brazil" },
          { name: "Japón", value: "japan" },
          { name: "Estados Unidos Central", value: "us-central" },
          { name: "Estados Unidos Este", value: "us-east" },
          { name: "Estados Unidos Oeste", value: "us-west" },
          { name: "Automático", value: "auto" }
        )
      )
    ),
  isGlobal: true,
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {


    if (!interaction.inGuild()) return await interaction.reply({ content: 'No puedes usar esta interacción fuera de un servidor.' });

    // Check for moderation perms
    if (interaction.memberPermissions.any(['Administrator', 'KickMembers', 'BanMembers', 'ModerateMembers'])) {

      const commandName = interaction.options.getSubcommand();

      switch (commandName) {
        case 'timeout':
          return await TimeoutMember(interaction);
        case 'anuncio':
          return await Announce(interaction);
        case 'encuesta':
          return await Poll(interaction);
        case 'region-de-voz':
          return await ChangeVoiceRegion(interaction);
      }

    } else {
      await interaction.reply({ content: 'No tienes los suficientes permisos para usar este comando. Necesitas al menos uno de los siguientes permisos: [Administrador, Expulsar Miembros, Prohibir Miembros, Moderar Miembros]', ephemeral: true });
    }
  }
}