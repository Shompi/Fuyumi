const { CommandInteraction, MessageEmbed, InteractionCollector } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { setStreamChannel, setEnabled, setStreamerRole } = require("./SubCommands/streams");

const Keyv = require('keyv');

/**
 * @type {Keyv<{channelId: string, roleId: string, enabled: Boolean}>}
 */
const StreamsConfigPerGuild = new Keyv('sqlite://StreamsConfigs.sqlite', { namespace: 'streamsConfig' });


module.exports = {
  data: new SlashCommandBuilder()
    .setName('streams')
    .setDescription('Configuraciones para transmisiones en el servidor')
    .addSubcommand(setChannelCommand => {
      return setChannelCommand.setName('canal')
        .setDescription('Configura el canal para enviar las transmisiones')
        .addChannelOption(channel => {
          return channel.setName('canal')
            .setDescription('Canal de texto en el que quieres que las transmisiones se envien')
            .setRequired(true)
        })
    })
    .addSubcommand(toggleCommand => {
      return toggleCommand.setName('habilitar')
        .setDescription('Activar o desactivar los mensajes de streams.')
        .addBooleanOption(input => {
          return input.setName('value')
            .setDescription('Verdadero para activar, Falso para desactivar')
            .setRequired(true);
        })
    })
    .addSubcommand(streamerRoleCommand => {
      return streamerRoleCommand.setName('rol')
        .setDescription('Rol de streamer de este servidor')
        .addRoleOption(role => {
          return role.setName('rol')
            .setDescription('Rol de streamer de este servidor')
            .setRequired(true)
        })
    }),
  isGlobal: true,

  /**
  * @param {CommandInteraction} interaction
  * @return {Promise<string|MessageEmbed>}
  */
  async execute(interaction) {
    if (!interaction.inGuild())
      return await interaction.reply({ content: 'Este comando solo puede ser utilizado en un servidor.' });

    if (interaction.member.partial)
      await interaction.member.fetch();

    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return await interaction.reply({
        content: "Solo miembros con el permiso de `Administrador` pueden usar este comando.",
        ephemeral: true
      });
    }

    const configs = await StreamsConfigPerGuild.get(interaction.guildId);

    if (!configs)
      await StreamsConfigPerGuild.set(interaction.guildId, { channelId: null, enabled: false, roleId: null });

    const commandName = interaction.options.getSubcommand();

    switch (commandName) {
      case 'canal':

        // Type checking
        const channel = interaction.options.getChannel('canal', true);

        if (channel.type !== 'GUILD_TEXT')
          return await interaction.reply({ content: 'Solo puedes asignar canales de texto con este comando. Por favor usa el comando nuevamente e ingresa un canal de texto.', ephemeral: true });

        else return await setStreamChannel({ interaction, channel, configs });


      case 'habilitar':

        const enabled = interaction.options.getBoolean('value', true);

        return await setEnabled({ interaction, enabled, configs });

      case 'rol':

        const role = interaction.options.getRole('rol', true);

        return await setStreamerRole({ interaction, role, configs });
    }
  }
}