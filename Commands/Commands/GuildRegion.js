const { Message, MessageEmbed, Collection } = require('discord.js');
const voiceRegions = ['eu-central', 'india', 'london', 'japan', 'amsterdam', 'brazil', 'us-west', 'hongkong', 'southafrica', 'sydney', 'europe', 'singapore', 'us-central', 'eu-west', 'dubai', 'us-south', 'us-east', 'frankfurt', 'russia']
const path = require('path');

const missingPermissions = (permission) =>
  new MessageEmbed()
    .setTitle(`❌ ¡Me faltan permisos!`)
    .setDescription(`Asegúrate de que yo tenga los siguientes permisos: [${permission.join(", ")}].`)
    .setColor("RED");

const noMemberPermissions = (author) =>
  new MessageEmbed()
    .setTitle(`❌ Permisos Insuficientes.`)
    .setDescription(`Lo siento ${author}, debes tener un rol autorizado para usar este comando.`)
    .setColor("RED")
    .setFooter("ERROR: MANAGE_GUILD");

const usage = (prefix, guild) =>
  new MessageEmbed()
    .setTitle(`La actual región de voz es: ${guild.region.toUpperCase()}`)
    .setDescription(`Debes especificar una región válida.`)
    .addFields(
      { name: "Ejemplo:", value: `\`${prefix}region brazil Pérdida de paquetes.\`` },
      { name: "Regiones Disponibles:", value: voiceRegions.join(", ") }
    )
    .setColor("BLUE");

const success = (author, region, image, reason) =>
  new MessageEmbed()
    .setTitle(`¡${author.tag} ha cambiado la región de Voz!`)
    .setDescription(`**Nueva región:** ${region.toUpperCase()}\n\n**Razón:** ${reason ? reason : "-"}`)
    .setImage(image)
    .setThumbnail(author.displayAvatarURL({ size: 512 }));


module.exports = {
  name: "region",
  guildOnly: true,
  filename: path.basename(__filename),
  description: "Mueve la región de voz del servidor.",
  usage: `\`region [Región] (Razón)\`\n\nLas regiones válidas son:\n\`\`\`${voiceRegions.join(", ")}\`\`\``,
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: ["MANAGE_GUILD"],
  cooldown: 5,
  async execute(message = new Message(), args = new Array()) {

    const { guild, attachments, author, member, channel, client: Muki } = message;

    const guildConfigs = Muki.db.guildConfigs.get(guild.id);

    if (!guildConfigs) return console.log(`La guild ${guild.name} no tenia un archivo de configuración. GuildRegion.js`);

    const adminRole = guildConfigs.adminRole;

    // If the member running the command doesn't have the adminRole, and is NOT the owner of the guild...
    if (!member.hasPermission('ADMINISTRATOR', { checkOwner: true }) && !member.roles.cache.has(adminRole)) return channel.send(noMemberPermissions(author));

    // If the bot doesn't have the permissions to change the Guild Region...
    if (!guild.me.hasPermission('MANAGE_GUILD', { checkAdmin: true })) return channel.send(missingPermissions(this.permissions));

    if (args.length === 0) return channel.send(usage(guildConfigs.prefix), guild);

    let region = args.shift().toLowerCase(), reason = args.join(" ");

    // If there is no args OR the region entered is not a valid voice region...
    if (!voiceRegions.includes(region)) return channel.send(usage(guildConfigs.prefix));

    if (guild.region === region) return channel.send(`${guild.name} ya se encuentra en esa región.`);

    let image = null;
    if (attachments.size >= 1) return image = attachments.first().url;

    try {
      await guild.setRegion(region, author.tag);

      if (guild.systemChannel)
        return guild.systemChannel.send(success(author, region, image, reason));
      else
        return channel.send(success(author, region, image, reason))
    } catch (error) {
      console.log(error);
      return channel.send(`Ha ocurrido un error al ejecutar este comando.`);
    }
  }
}