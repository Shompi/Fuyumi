const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { ImageResize } = require('./SubCommands/image-resize.js');
// Subcommands

module.exports = {
  hasSubcommands: true,
  subcommands: ["image-resize"],
  data: new SlashCommandBuilder()
    .setName('imagen')
    .setDescription('Varios comandos para editar imágenes')

    // Resize images
    .addSubcommand(resize =>
      resize.setName('resize')
        .setDescription('Reescala una imagen junto a otras opciones')
        .addAttachmentOption(attachment =>
          attachment.setName('archivo')
            .setDescription('La imágen que quieres editar')
        )
        .addStringOption(url =>
          url.setName('url')
            .setDescription('La url de la imágen en caso de que sea una imagen online')
        )
        .addStringOption(outputName =>
          outputName.setName('nombre')
            .setDescription('El nombre final del archivo')
        )
        .addIntegerOption(width => width.setName('largo').setDescription('Nuevo largo de la imagen en pixeles (MAX: 2048, MIN: 8)').setMaxValue(2048).setMinValue(8))
        .addIntegerOption(height => height.setName('altura').setDescription('Nueva altura de la imagen en pixeles (MAX: 2048, MIN: 8)').setMaxValue(2048).setMinValue(8))
        .addStringOption(outputFormat =>
          outputFormat.setName('formato')
            .setDescription('El formato final de la imagen')
            .setChoices(
              { name: 'JPG / JPEG', value: 'jpeg' },
              { name: 'PNG', value: 'png' },
              { name: 'WEBP', value: 'webp' },
              { name: 'GIF', value: 'gif' }
            )
        )
        .addIntegerOption(quality => quality.setName('calidad').setDescription('Calidad de la compresión (JPEG, PNG o WEBP) (1 - 100)').setMinValue(1).setMaxValue(100))
    )
  ,
  isGlobal: false,
  /**
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {

    const command = interaction.options.getSubcommand();

    switch (command) {
      case 'resize':
        return ImageResize(interaction);
    }
  }
}