const { CommandInteraction, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch').default;
const Sharp = require('sharp');

/**
 * 
 * @param {CommandInteraction} interaction 
 */
module.exports.ImageResize = async (interaction) => {
  const options = {
    name: interaction.options.getString('nombre', false),
    height: interaction.options.getInteger('altura', false),
    width: interaction.options.getInteger('largo', false),
    format: interaction.options.getString('formato', false) ?? 'png',
    url: interaction.options.getAttachment('archivo', false)?.url ?? interaction.options.getString('url', false),
    quality: interaction.options.getInteger('calidad', false)
  }

  if (!options.url)
    return await interaction.reply({
      content: 'Debes añadir al menos un archivo **.jpg, .jpeg, .png, .webp o .gif** o una URL válida de una imagen.',
      ephemeral: true
    })

  await interaction.deferReply({ ephemeral: true })

  const imageBuffer = await fetch(options.url).then(response => response.buffer()).catch(err => console.log(err));

  if (!imageBuffer)
    return await interaction.editReply({
      content: 'Ocurrió un error al intentar conseguir la imagen. Inténtalo más tarde.'
    });

  const output = Sharp(imageBuffer)
    .resize({ height: options.height, width: options.width });

  if (options.format === 'jpg')
    output.jpeg({ quality: options.quality })
  else if (options.format === 'png')
    output.png({ quality: options.quality })
  else if (options.format === 'gif')
    output.gif()
  else if (options.format === 'webp')
    output.webp({ quality: options.quality })

  const outputBuffer = await output.toBuffer();

  const outputAttachment = new MessageAttachment(outputBuffer, `${options.name}.${options.format}` ?? `OUTPUT.${options.format}`);

  return await interaction.editReply({
    content: '¡Aquí está tu nueva imagen!\nDebes descargarla antes de eliminar este mensaje. Si copias la URL de la imagen y borras este mensaje, la imagen desaparecerá y la URL no funcionará.',
    files: [outputAttachment]
  })
}