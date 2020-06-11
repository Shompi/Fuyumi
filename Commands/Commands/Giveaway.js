const { MessageEmbed, Message, Collection } = require('discord.js');
const { basename } = require('path');
const Prettyms = require('pretty-ms');
const ONEHOUR = 1000 * 60 * 60;

const infoEmbed =
  new MessageEmbed()
    .setTitle(`❌ ¡No puedes iniciar un sorteo!`)
    .setDescription("Para hacer un sorteo, debe haber un canal llamado \"giveaways\" creado, o el comando debe ser ejecutado por alguien que tenga permisos de administrador o para administrar canales.\nTambién verifica que yo tenga el permiso **\"MANAGE_CHANNELS\"** para poder crear el canal.")
    .setColor("BLUE");

const giveawayEmbed = ({ member, sorteo, minutos }) => {
  const millis = (1000 * 60) * minutos;
  return new MessageEmbed()
    .setTitle(`¡${member.user.tag} ha iniciado un sorteo!`)
    .setThumbnail(member.user.displayAvatarURL({ size: 256, dynamic: true }))
    .setDescription(`**${sorteo}**\n\n¡Reacciona con 🎉 para participar!`)
    .setColor("BLUE")
    .setFooter(`Termina en: ${Prettyms(millis, { verbose: true })}`);
}

const giveawayEmbedFinished = (info) => {
  // {host, winner, iterations, contestants, prize}

  const {host, winner, iterations, contestants, prize} = info;
  console.log(iterations);
  
  return new MessageEmbed()
    .setTitle(`🎇\t¡Felicidades ${winner.username}!\t🎊`)
    .setThumbnail(winner.displayAvatarURL({ size: 256, dynamic: true }))
    .setDescription(`Has ganado: **${prize}**\nSorteado por: <@${host.id}>`)
    .addField('Mejor suerte para la próxima:', `\`\`\`${contestants.map(user => user.tag).join(", ")}\`\`\``)
    .setColor("BLUE")
    .setFooter(`Número de iteraciones: ${iterations}`)
}

const currentGiveaways = new Collection();
const channelNames = ["sorteos", "giveaway", "giveaways", "sorteo"];


module.exports = {
  name: "sorteo",
  aliases: ["giveaway", "sortear", "regalar", "gaway", "giveaways"],
  nsfw: false,
  guildOnly: true,
  adminOnly: false,
  enabled: true,
  permissions: ["MANAGE_CHANNELS"],
  description: "Inicia un sorteo en el servidor.",
  usage: "giveaway [Tiempo en minutos.] [Lo que quieres sortear]",
  filename: basename(__filename),

  async execute(message = new Message(), args = new Array()) {
    const { guild, client: Muki, channel, member, author } = message;

    if (!member.hasPermission("ADMINISTRATOR", { checkOwner: true }) && guild.id !== "537484725896478733")
      return channel.send(`Lo siento ${author}, ¡solo los miembros con el permiso "ADMINISTRADOR" pueden comenzar un sorteo!`);

    const giveawayTime = args.shift();
    if (giveawayTime == 'cancel') {
      const giveawayToCancel = currentGiveaways.get(guild.id);
      if (!giveawayToCancel)
        return channel.send(`No hay ningún sorteo en curso...`);

      if (author.id === giveawayToCancel.host && !giveawayToCancel.deleted) {
        await giveawayToCancel.delete({ reason: "Cancelado por el usuario." }).catch(console.error);
        return channel.send(`Tu sorteo ha sido cancelado.`);
      }
    }

    const prefix = Muki.db.guildConfigs.get(guild.id).prefix;

    if (isNaN(giveawayTime))
      return channel.send(`${author} debes especificar un tiempo en minutos como primer argumento.\nEscribe \`${prefix}help giveaway\` para más información.`);

    //Time limits.
    if (giveawayTime > ONEHOUR * 12)
      return channel.send(`${author} no puedes hacer un sorteo con una duración mayor a **12 horas.**\nRecuerda: El tiempo ingresado es convertido a **minutos** automáticamente.`);

    if (giveawayTime < 1)
      return channel.send(`${author} lo siento, no puedes hacer un sorteo con una duración menor a 1 minuto.`);

    if (args.length === 0)
      return channel.send(`¡Debes escribir que es lo que vas a sortear!`);

    let giveawayChannel = guild.channels.cache.find(ch => ch.type === 'text' && channelNames.includes(ch.name));


    if (!giveawayChannel) {
      console.log("Giveaway channel not found.");
      if (!member.hasPermission("MANAGE_CHANNELS", { checkAdmin: true, checkOwner: true }) || !guild.me.hasPermission('MANAGE_CHANNELS'))
        return channel.send(infoEmbed);

      try {
        giveawayChannel = await guild.channels.create("giveaways", {
          type: 'text',
          topic: '¡Canal para sorteos! Reacciona al mensaje con 🎉 ¡y participa en el sorteo que esté vigente!',
          nsfw: false,
          permissionOverwrites: [
            {
              id: guild.id,
              deny: "SEND_MESSAGES",
              allow: "VIEW_CHANNEL"
            },
            {
              id: Muki.user.id,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
            }
          ],
          reason: "Canal de sorteos."
        });

      } catch (err) {
        console.log(err);
        return channel.send(`Hubo un error al intentar crear el canal Giveaways. Verifica que yo tenga el permiso de administrar canales.`);
      }
    }

    console.log(`Giveaway channel: ${giveawayChannel.name}, ${giveawayChannel.id}`);
    const giveawayMessage = await giveawayChannel.send(giveawayEmbed({ member: member, sorteo: args.join(" "), minutos: giveawayTime }));
    giveawayMessage.host = member.id;

    await giveawayMessage.react('🎉');

    currentGiveaways.set(guild.id, giveawayMessage);

    await channel.send(`¡El sorteo ha comenzado en el canal <#${giveawayMessage.channel.id}>!\nPara cancelarlo escribe \`${prefix}sorteo cancel\``);

    const filter = (reaction, user) => reaction.emoji.name == '🎉';

    try {
      const collectedReactions = await giveawayMessage.awaitReactions(filter, { time: 1000 * 60 * giveawayTime });

      //Giveaway is finished.
      currentGiveaways.delete(guild.id);

      if (giveawayMessage.deleted)
        return;

      const reaction = collectedReactions.get('🎉');

      if (!reaction) {
        await giveawayMessage.delete({ reason: "Insuficientes participantes." });
        return channel.send(`${author}, No se consigió la cantidad necesaria de reacciones, o el emoji "🎉" fué quitado de las reacciones.`);
      }
      if (reaction.count <= 2) {
        await channel.send(`${author} ¡tu sorteo ha sido anulado debido a la baja cantidad de participantes!`);
        return giveawayMessage.delete()
      }

      const users = reaction.users.cache.filter(user => !user.bot);

      let choosenUser;

      let iter = Math.floor(Math.random() * 101);

      for (let i = 0; i < iter; i++)
        choosenUser = users.random();


      users.delete(choosenUser.id);

      return giveawayMessage.edit(`<@${choosenUser.id}>`, giveawayEmbedFinished({ winner: choosenUser, prize: args.join(" "), host: member, contestants: users, iterations: iter }));

    } catch (err) {

      console.log("Hubo un error en el comando Giveaway.js");
      console.log(err);

      return channel.send(`${author} Ocurrió un error mientras se hacia el sorteo, ¡lo siento mucho!`);
    }
  }
}