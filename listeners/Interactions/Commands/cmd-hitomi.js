// @ts-check
const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const Hitomi = require('node-hitomi').default;


module.exports = {
  data: new SlashCommandBuilder()
    .setName('hitomi')
    .setDescription('Obtén info de un doujin de Hitomi')
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

    const hitomiId = interaction.options.getInteger('numeros', true);

    /**
     * @type {Hitomi.Gallery} 
     */
    //@ts-ignore 
    const result = await Hitomi.getGallery(hitomiId, { includeFullData: true, includeFiles: true }).catch(console.log);

    if (!result)
      return await interaction.editReply({ content: 'No encontré un Doujin con esta Id en Hitomi u ocurrió un error con la búsqueda.' });


    const galleryUrl = Hitomi.getGalleryUrl(result);
    const imageUrl = Hitomi.getImageUrl(result.files[1], result.files[1].extension);

    const doujinEmbed = new MessageEmbed()
      .setAuthor({ name: `Numeros nucleares: ${result.id}` })
      .setTitle(`${result.title.display} ${result.title.japanese ? "(" + result.title.japanese + ")" : ""}`)
      .addField("Información General", `**Idioma**: ${result.languageName.local}\n`
        + `**Tipo**: ${result.type}\n`
        + `**Artista/s**: ${result.artists.join(", ")}\n`
        + `**Grupos**: ${result.groups.join(", ")}\n`
        + `**Series**: ${result.series.join(", ")}\n`
        + `**Personajes**: ${result.characters.join(", ")}\n`)
      .addField("Etiquetas", `**Mujer**: ${result.tags.filter(tag => tag.type === "female").map(tag => tag.name).join(", ")}\n`
        + `**Hombre**: ${result.tags.filter(tag => tag.type === 'male').map(tag => tag.name).join(", ")}\n`
        + `**Otros**: ${result.tags.filter(tag => tag.type === "tag").map(tag => tag.name).join(", ")}\n`)
      .setImage(imageUrl)
      .setColor("BLUE");

    console.log("IMAGEURL", imageUrl);

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle("LINK")
          .setLabel("Ver en la página")
          .setURL(galleryUrl)
      );

    return await interaction.editReply({ embeds: [doujinEmbed], components: [row] });
  }
}


/*
.setDescription(
        `__Información General__\n`
        + `**Idioma**: ${result.languageName.local}\n`
        + `**Tipo**: ${result.type}\n`
        + `**Artista/s**: ${result.artists.join(", ")}\n`
        + `**Grupos**: ${result.groups.join(", ")}\n`
        + `**Series**: ${result.series.join(", ")}\n`
        + `**Personajes**: ${result.characters.join(", ")}\n`
        + `\n`
        + `__Tags__\n`
        + `**Mujer**: ${result.tags.filter(tag => tag.type === "female").map(tag => tag.name).join(", ")}\n`
        + `**Hombre**: ${result.tags.filter(tag => tag.type === 'male').map(tag => tag.name).join(", ")}\n`
        + `**Otros**: ${result.tags.filter(tag => tag.type === "tag").map(tag => tag.name).join(", ")}\n`)
*/