const { Message, MessageEmbed, Collection } = require('discord.js');
const voiceRegions = ['eu-central', 'india', 'london', 'japan', 'amsterdam', 'brazil', 'us-west', 'hongkong', 'southafrica', 'sydney', 'europe', 'singapore', 'us-central', 'eu-west', 'dubai', 'us-south', 'us-east', 'frankfurt', 'russia']
const cooldowns = new Set();
const path = require('path');
const database = require('../LoadDatabase').guildConfigs;


const missingPermissions = (permission) =>
  new MessageEmbed()
    .setTitle(`❌ ¡Me faltan permisos!`)
    .setDescription(`Asegúrate de que yo tenga los siguientes permisos: [${permission.join(", ")}].`)
    .setColor("RED");

const cooldownEmbed = new MessageEmbed()
  .setTitle("Cooldown.")
  .setDescription(`Debes esperar al menos **5** segundos antes de volver a usar este comando!`)
  .setColor("BLUE");

const noMemberPermissions = (author) =>
  new MessageEmbed()
    .setTitle(`❌ Permisos Insuficientes.`)
    .setDescription(`Lo siento ${author}, debes tener un rol autorizado para usar este comando.`)
    .setColor("RED")
    .setFooter("ERROR: MANAGE_GUILD");

const usage = (prefix) =>
  new MessageEmbed()
    .setTitle('❌ Argumentos inválidos:')
    .setDescription(`Debes especificar una región válida.`)
    .addFields(
      { name: "Ejemplo:", value: `\`${prefix}region brazil Pérdida de paquetes.\`` },
      { name: "Regiones Disponibles:", value: voiceRegions.join(", ") }
    )
    .setColor("BLUE");

const noAdminRole = (guild, prefix) =>
  new MessageEmbed()
    .setTitle(`${guild.name} no tiene un rol de Administrador / Staff`)
    .setDescription(`Para añadir un rol de Administrador, escribe \`${prefix}adminrole [@Mención de rol]\`\n\nNota: El rol debe estar creado de antemano.`)
    .setColor("BLUE");

const roleNotFound =
  new MessageEmbed()
    .setTitle('🔎 No he encontrado el rol de administrador en esta guild.')
    .setDescription(`Asegurate de que el rol exista, probablemente necesites usar el comando \`adminrole\` de nuevo.`)
    .setColor("YELLOW");

const success = (author, region, image, reason) =>
  new MessageEmbed()
    .setTitle(`¡${author.tag} ha cambiado la región de Voz!`)
    .setDescription(`**Nueva región:** ${region.toUpperCase()}\n\n**Razón:** ${reason ? reason : "-"}`)
    .setImage(image)
    .setThumbnail(author.displayAvatarURL({ size: 512 }));


module.exports = {
  name: "region",
  filename: path.basename(__filename),
  description: "Mueve la región de voz del servidor.",
  usage: "region [Región] (Razón)",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: ["MANAGE_GUILD"],
  async execute(message = new Message(), args = new Array()) {

    const { guild, attachments, author, member, channel, client: Muki } = message;

    if (cooldowns.has(guild.id)) return await channel.send(cooldownEmbed);

    const guildConfigs = database.get(guild.id);
    if (!guildConfigs) return console.log(`La guild ${guild.name} no tenia un archivo de configuración. GuildRegion.js`);

    const adminRole = guildConfigs.adminRole;

    // If the member running the command doesn't have the adminRole, and is NOT the owner of the guild...
    if (!member.hasPermission('ADMINISTRATOR', { checkOwner: true }) && !member.roles.cache.has(adminRole)) return await channel.send(noMemberPermissions(author));

    // If the bot doesn't have the permissions to change the Guild Region...
    if (!guild.me.hasPermission('MANAGE_GUILD', { checkAdmin: true })) return await channel.send(missingPermissions(this.permissions));

    if (args.length === 0) return await channel.send(usage(guildConfigs.prefix));

    let region = args.shift().toLowerCase(), reason = args.join(" ");

    // If there is no args OR the region entered is not a valid voice region...
    if (!voiceRegions.includes(region)) return await channel.send(usage(guildConfigs.prefix));

    if (guild.region === region) return await channel.send(`${guild.name} ya se encuentra en esa región.`);
    let image = null;
    if (attachments.size >= 1) return image = attachments.first().url;
    try {
      await guild.setRegion(region, author.tag);
      cooldowns.add(guild.id);

      Muki.setTimeout(() => cooldowns.delete(guild.id), 5000);
      return channel.send(success(author, region, image, reason));
    } catch (error) {
      console.log(error);
      return await channel.send(`Ha ocurrido un error al ejecutar este comando.`);
    }
  }
}