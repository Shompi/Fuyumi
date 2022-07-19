//@ts-check
const { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } = require('discord.js')

/** @type {Map<String, {timestamp: number}>} */
const cooldowns = new Map();
const COOLDOWNTIMEMS = 10 * 1000 // 10 segundos
module.exports = {
  data: new SlashCommandBuilder()
    .setName('pilin')
    .setDescription('Revela al mundo el tamaño de tu pilín'),
  isGlobal: true,

  /**
   * 
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {

    if (interaction.inCachedGuild()) {
      if (cooldowns.has(interaction.member.id)) {
        //@ts-ignore
        const timestamp = cooldowns.get(interaction.member.id).timestamp;

        const timeNow = Date.now();

        const timeleft = Math.floor((timestamp - timeNow) / 1000);

        return await interaction.reply({ ephemeral: true, content: `Debes esperar **${timeleft}** segundos antes de usar este comando nuevamente.` });
      }

      // Añadir al miembro a la lista de cooldowns
      cooldowns.set(interaction.member.id, { timestamp: Date.now() + COOLDOWNTIMEMS });

      setTimeout(() => {
        cooldowns.delete(interaction.member.id)
      }, COOLDOWNTIMEMS);

      const medida = Math.floor(Math.random() * 51) || 1000

      //@ts-check
      const embed = new EmbedBuilder()
        .setAuthor({ iconURL: interaction.member.displayAvatarURL({ size: 64 }), name: interaction.member.displayName })
        .setDescription(`**¡La 🍌 de ${interaction.member} mide ${medida}cm!**`)
        .setColor(interaction.member.displayColor);

      return await interaction.reply({ embeds: [embed] });
    }
  }
}