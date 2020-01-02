const { Message, MessageEmbed } = require('discord.js');
const voiceRegions = ['eu-central', 'india', 'london', 'japan', 'amsterdam', 'brazil', 'us-west', 'hongkong', 'southafrica', 'sydney', 'europe', 'singapore', 'us-central', 'eu-west', 'dubai', 'us-south', 'us-east', 'frankfurt', 'russia']
let cooldown = false;

module.exports = async (message = new Message()) => {
  if (cooldown) return await message.reply("debes esperar 5 segundos antes de volver a usar este comando!");
  let content = message.content.split(" ");
  const command = content.shift();
  let region = content.shift();
  if (region) region = region.toLowerCase();
  let reason = content.join(" ");
  let guild;
  let image = null;
  if (message.attachments.size >= 1) image = message.attachments.first().url;
  if (!region) {
    if (message.guild.region == 'brazil') guild = await message.guild.setRegion('us-east', message.author.tag).catch(console.error);
    else guild = await message.guild.setRegion('brazil', message.author.tag).catch(console.error);

    cooldown = true;
    setTimeout(() => {
      cooldown = false;
    }, 5000, cooldown);


    const embed = new MessageEmbed()
      .setTitle(message.author.tag)
      .setThumbnail(message.author.displayAvatarURL({ size: 256 }))
      .setDescription(`Ha cambiado la región de **${guild.name}** a **${guild.region.toUpperCase()}**`)
      .setColor("BLUE")
      .setTimestamp();

    if (image) embed.setImage(image);
    
    return await message.guild.channels.find(ch => ch.name === 'guild-changes').send(embed).then(msg => message.delete({ timeout: 2000 })).catch(console.error);
  } else {
    if (!voiceRegions.includes(region.toLowerCase())) return await message.reply("la región que has ingresado no existe o la has escrito mal!").catch(console.error);
    if (message.guild.region === region) return await message.reply("la Guild ya se encuentra en esa región.");
    guild = await message.guild.setRegion(region);
    const embed = new MessageEmbed()
      .setTitle(message.author.tag)
      .setThumbnail(message.author.displayAvatarURL({ size: 256 }))
      .setDescription(`Ha cambiado la región de **${guild.name}** a **${guild.region.toUpperCase()}**${reason ? `\n**Razón:** ${reason}` : ''}`)
      .setColor("BLUE")
      .setTimestamp();

    if (image) embed.setImage(image);

    cooldown = true;
    setTimeout(() => {
      cooldown = false;
    }, 5000, cooldown);
    return await message.guild.channels.find(ch => ch.name === 'guild-changes').send(embed).then(msg => message.delete({ timeout: 2000 })).catch(console.error);
  }
}