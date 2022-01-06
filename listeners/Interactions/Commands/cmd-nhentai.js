// @ts-check
const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
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
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {

    const { channel } = interaction;

    if (interaction.inGuild() && channel.isText()) {
      // @ts-ignore
      if (!channel.nsfw)
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

    const doujinEmbed = new MessageEmbed()
      .setAuthor({ name: `Numeros nucleares: ${result.id}` })
      .setTitle(`${result.titles.pretty}`)
      .addField("Información General",
        `**Idioma**: ${result.tags.languages.map(tag => tag.name).join(", ")}\n`
        + `** Artista / s **: ${result.tags.artists.map(tag => tag.name).join(", ") || "-"}\n`
        + `** Categorias **: ${result.tags.categories.map(tag => tag.name).join(", ") || "-"}\n`
        + `** Personajes **: ${result.tags.characters.map(tag => tag.name).join(", ") || "-"}\n`
        + `** Parodia de **: ${result.tags.parodies.map(tag => tag.name).join(", ") || "-"}\n`)
      .addField("Etiquetas", `${result.tags.tags.map(tag => tag.name).join(", ")}`)
      .setImage(result.pages[1].url)
      .setThumbnail(result.cover.url)
      .setColor("BLUE");

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle("LINK")
          .setLabel("Ver en la página")
          .setURL(result.url)
      );

    return await interaction.editReply({ embeds: [doujinEmbed], components: [row] });
  }
}