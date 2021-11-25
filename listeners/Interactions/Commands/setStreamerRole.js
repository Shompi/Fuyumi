const { CommandInteraction, MessageEmbed } = require("discord.js");
const fetch = require('node-fetch').default;
const { SlashCommandBuilder } = require('@discordjs/builders');
const keyv = require('keyv');
const StreamsConfigPerGuild = new keyv('sqlite://StreamsConfigs.sqlite', { namespace: 'streamsConfig' });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('streams')
    .setDescription('Configuraciones para transmisiones en el servidor')
    .addRoleOption(role => role.setName('rol')
      .setDescription('El rol de streamer de este servidor')
      .setRequired(true)
    )
    .addChannelOption(channel => channel.setName('canal')
      .setDescription('El canal donde quieres que se envien los directos')
      .setRequired(true)
    )
    .addStringOption(enabled => enabled.setName('estado')
      .setDescription('"Activados" para que los directos aparezcan, "Desactivados" para que no se envien.')
      .setRequired(true)
      .addChoice("Activados", "true")
      .addChoice("Desactivados", "false")
    ),
  /**
  * @param {CommandInteraction} interaction
  * @return {Promise<string|MessageEmbed>}
  */
  async execute(interaction) {


    if (interaction.member.id !== interaction.guild.ownerId) {
      await interaction.reply({
        content: "Lo siento, solamente el dueño del servidor puede usar este comando.",
        ephemeral: true
      });
      return;
    }

    const StreamerRole = interaction.options.getRole('rol');
    const StreamsChannel = interaction.options.getChannel('canal');
    const Enabled = interaction.options.getString('estado');

    if (StreamsChannel.type !== 'GUILD_TEXT') return await interaction.reply({
      content: "El canal que ingresaste no es un canal de texto.",
      ephemeral: true
    });

    await StreamsConfigPerGuild.set(interaction.guild.id, { roleId: StreamerRole.id, channelId: StreamsChannel.id, enabled: new Boolean(Enabled) });

    return await interaction.reply({
      content: `El rol ${StreamerRole.name} (${StreamerRole.id}) fue agregado con éxito!\nLos directos se enviarán en el canal <#${StreamsChannel.id}>`,
      ephemeral: true
    });
  }
}