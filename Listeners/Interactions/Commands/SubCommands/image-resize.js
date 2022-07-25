//@ts-check
const axios = require('axios').default
const { ChatInputCommandInteraction, AttachmentBuilder, EmbedBuilder, Colors } = require('discord.js');
const Sharp = require('sharp');
const urlRegexp = new RegExp(/[.](jpg|jpeg|png|gif|webp)$/gm);

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
module.exports.ImageResize = async (interaction) => {

  const options = {
    name: interaction.options.getString('nombre', false) ?? "output",
    height: interaction.options.getInteger('altura', false),
    width: interaction.options.getInteger('largo', false),
    format: '',
    url: interaction.options.getAttachment('archivo', false)?.url ?? interaction.options.getString('url', false),
    quality: interaction.options.getInteger('calidad', false) ?? 80
  }

  if (!options.url)
    return await interaction.reply({
      content: 'Debes añadir al menos un archivo **.jpg, .jpeg, .png, .webp o .gif** o una URL válida de una imagen.',
      ephemeral: true
    })
  if (!urlRegexp.test(options.url))
    return await interaction.reply({
      content: 'La url o el archivo que has ingresado no es una imagen.\nAsegurate que la url apunte directamente a una imagen online, o que el archivo que subas sea un archivo válido.'
    })

  await interaction.deferReply({ ephemeral: true })


  const imageArrayBuffer = await axios.get(options.url, { responseType: 'arraybuffer' }).then(response => response.data).catch(err => console.log(err));

  const imageBuffer = Buffer.from(imageArrayBuffer, 'binary')
  if (!imageBuffer)
    return await interaction.editReply({
      content: 'Ocurrió un error al intentar conseguir la imagen. Inténtalo más tarde.'
    });

  const oldMetadata = await getImageMetadata(imageBuffer);

  // @ts-ignore
  options.format = interaction.options.getString('format', false) ?? oldMetadata.format;

  const output = Sharp(imageBuffer)
    // @ts-ignore
    .resize({ height: options.height, width: options.width });

  if (options.format === 'jpeg')
    output.jpeg({ quality: options.quality });
  else if (options.format === 'png')
    output.png({ quality: options.quality });
  else if (options.format === 'gif')
    output.gif();
  else if (options.format === 'webp')
    output.webp({ quality: options.quality });

  const outputBuffer = await output.toBuffer();

  const outputAttachment = new AttachmentBuilder(outputBuffer).setName("OUTPUT." + options.format);

  const newMetadata = await getImageMetadata(outputBuffer);

  const statisticsEmbed = new EmbedBuilder()
    .setTitle('Estadísticas de la conversión')
    .setDescription(`**Peso (KB)**: **${oldMetadata.size / 1000}** -> **${newMetadata.size / 1000}**, **(${calculatePercentage(oldMetadata.size, newMetadata.size)})**`
      + `\n**Dimensiones LargoxAncho (px)**: **${oldMetadata.width}x${oldMetadata.height}** -> **${newMetadata.width}x${newMetadata.height}**`
      + `\n**Formato**: **${oldMetadata.format}** -> **${newMetadata.format}**`)
    .setColor(Colors.Blue)
    .setImage(`attachment://${options.name}.${options.format}`)
    .setFooter({ text: "Las imágenes procesadas no son guardadas localmente.", iconURL: interaction.client.user.displayAvatarURL({ size: 128 }) })
    .setTimestamp();

  return await interaction.editReply({
    content: '¡Aquí está tu nueva imagen!\nDebes descargarla antes de eliminar este mensaje. Si copias la URL de la imagen y borras este mensaje, la imagen desaparecerá y la URL no funcionará.',
    files: [outputAttachment],
    embeds: [statisticsEmbed]
  })
}

async function getImageMetadata(buffer) {
  return await Sharp(buffer).metadata();
}

/**
 * 
 * @param {Number} oldSize El tamaño original del archivo
 * @param {Number} newSize El nuevo tamaño del archivo
 */
function calculatePercentage(oldSize, newSize) {

  const firstOperation = oldSize / newSize;
  const secondOperation = 1 / firstOperation;
  const thirdOperation = secondOperation * 100;
  const result = 100 - thirdOperation;

  if (result <= 0)

    return `${(Math.abs(thirdOperation) - 100).toFixed(2)}% más peso`
  else
    return `${Math.abs(result).toFixed(2)}% menos peso`
}