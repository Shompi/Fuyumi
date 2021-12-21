const { CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('ppplplplplpllppliplupliplup')
    .addSubcommand(guildInfo => {
      return guildInfo
        .setName('server')
        .setDescription('Información del servidor');
    }),
  isGlobal: false,

  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    const commandName = interaction.options.getSubcommand();

    if (commandName === 'server') {
      const members = await interaction.guild.members.fetch();

      let humans = 0;
      let bots = 0;
      for (const [_id, member] of members) {
        if (member.user.bot)
          bots += 1;
        else
          humans += 1;
      }

      const serverInfo = new MessageEmbed()
        .setTitle(interaction.guild.name)
        .setDescription(`El dueño actual del servidor es <@${interaction.guild.ownerId}>\nNúmero de roles: ${interaction.guild.roles.cache.size}\nCantidad de canales: ${interaction.guild.channels.cache.size}\nCantidad de miembros actuales: ${members.size} (${humans} Humanos, ${bots} Bots)`)
        .setThumbnail(interaction.guild.iconURL({ size: 512, dynamic: true }))
        .setColor(interaction.member.displayColor)
        .setFooter(`Servidor creado el`)
        .setTimestamp(interaction.guild.createdTimestamp);

      return await interaction.reply({
        embeds: [serverInfo]
      });
    }
  }
}