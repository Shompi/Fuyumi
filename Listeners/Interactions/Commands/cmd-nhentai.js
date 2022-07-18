// @ts-check
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, Colors, ButtonStyle } = require('discord.js')
const ApiConstructor = require('nhentai');
const nHentai = new ApiConstructor.API();


module.exports = {
  data: new SlashCommandBuilder()
    .setName('nhentai')
    .setDescription('Obtén info de un doujin de nHentai')
    .addIntegerOption(id => {
      return id.setName('numeros')
        .setDescription('Números nucleares del doujin')
        .setRequired(true)
    }),
  isGlobal: true,
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {

    if (interaction.inCachedGuild() && interaction.channel?.type === ChannelType.GuildText) {

      if (!interaction.channel.nsfw)
        return await interaction.reply({ content: 'No puedes usar este comando fuera de canales **NSFW**.', ephemeral: true })
    }

    await interaction.deferReply();

    const galleryId = interaction.options.getInteger('numeros', true);

    /**
     * @type {ApiConstructor.Doujin}
     */
    //@ts-ignore
    const result = await nHentai.fetchDoujin(galleryId).catch(console.log);

    if (!result)
      return await interaction.editReply({ content: 'No encontré un Doujin con esta Id en nHentai u ocurrió un error con la búsqueda.' });

    const doujinEmbed = new EmbedBuilder()
      .setAuthor({ name: `Numeros nucleares: ${result.id}`, iconURL: interaction.user.displayAvatarURL({ size: 64 }) })
      .setTitle(`${result.titles.pretty}`)
      .addFields({
        name: "Información General", value: `**Idioma**: ${result.tags.languages.map(tag => tag.name).join(", ")}\n`
          + `** Artista / s **: ${result.tags.artists.map(tag => tag.name).join(", ") || "-"}\n`
          + `** Categorias **: ${result.tags.categories.map(tag => tag.name).join(", ") || "-"}\n`
          + `** Personajes **: ${result.tags.characters.map(tag => tag.name).join(", ") || "-"}\n`
          + `** Parodia de **: ${result.tags.parodies.map(tag => tag.name).join(", ") || "-"}\n`
      },
        {
          name: "Etiquetas", value: result.tags.tags.map(tag => tag.name).join(", ")
        })
      .setThumbnail(result.cover.url)
      .setColor(Colors.Blue);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel("Ver en la página")
          .setURL(result.url)
      );

    return await interaction.editReply({ embeds: [doujinEmbed], components: [row] });
  }
}