const { Message, MessageEmbed } = require('discord.js');
const voiceRegions = ['eu-central', 'india', 'london', 'japan', 'amsterdam', 'brazil', 'us-west', 'hongkong', 'southafrica', 'sydney', 'europe', 'singapore', 'us-central', 'eu-west', 'dubai', 'us-south', 'us-east', 'frankfurt', 'russia']
let cooldown = false;

const missingPermissions = (permission) =>
  new MessageEmbed()
    .setTitle(`❌ ¡Me faltan permisos!`)
    .setDescription(`Asegúrate que tengo el permiso ${permission}.`)
    .setColor("RED");

const cooldownEmbed = new MessageEmbed()
  .setTitle("Cooldown.")
  .setDescription(`Debes esperar al menos **5** segundos antes de volver a usar este comando!`)
  .setColor("BLUE");

module.exports = {
  name: "region",
  description: "Mueve la región de voz del servidor. Ambos parámetros son opcionales, pero solo puede haber una **Razón** si se especifica una **Región**.",
  usage: "region (Región) (Razón)",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: ["MANAGE_GUILD"],
  async execute(message = new Message(), args = new Array()) {
    const { guild, attachments, author } = message;
    if (!guild.me.hasPermission('MANAGE_GUILD', { checkAdmin: true })) return await message.channel.send(missingPermissions(this.permissions));

    if (cooldown) return await message.reply(cooldownEmbed);

    let region = args.shift().toLowerCase(), reason = args.join(" ");
    let _guild, image = null;

    if (attachments.size >= 1) image = attachments.first().url;

    if (!region) {

      if (guild.region == 'brazil') _guild = await guild.setRegion('us-east', author.tag).catch(console.error);
      else _guild = await guild.setRegion('brazil', author.tag).catch(console.error);

      cooldown = true;
      setTimeout(() => {
        cooldown = false;
      }, 5000, cooldown);


      const embed = new MessageEmbed()
        .setTitle(author.tag)
        .setThumbnail(author.displayAvatarURL({ size: 256 }))
        .setDescription(`Ha cambiado la región de **${guild.name}** a **${_guild.region.toUpperCase()}**`)
        .setColor("BLUE")
        .setTimestamp();
      if (image) embed.setImage(image);

      const channel = guild.systemChannel;
      if (!channel) return await message.channel.send(embed);
      else return await channel.send(embed);

    }
    else {
      if (!voiceRegions.includes(region)) return await message.reply(`¡la región que has ingresado no existe o la has escrito mal!\n${this.usage}`).catch(console.error);
      if (guild.region === region) return await message.reply("la Guild ya se encuentra en esa región.");
      _guild = await guild.setRegion(region);

      const embed = new MessageEmbed()
        .setTitle(author.tag)
        .setThumbnail(author.displayAvatarURL({ size: 256 }))
        .setDescription(`Ha cambiado la región de **${guild.name}** a **${_guild.region.toUpperCase()}**${reason ? `\n**Razón:** ${reason}` : ''}`)
        .setColor("BLUE")
        .setTimestamp();

      if (image) embed.setImage(image);

      cooldown = true;
      setTimeout(() => {
        cooldown = false;
      }, 5000, cooldown);

      const channel = guild.systemChannel;

      if (!channel) return await message.channel.send(embed);

      else return await channel.send(embed);
    }
  }
}