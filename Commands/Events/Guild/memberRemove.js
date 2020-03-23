const { MessageEmbed, GuildMember, User } = require('discord.js');
const database = require('../../LoadDatabase').guildConfigs;

module.exports = async (member = new GuildMember()) => {
  if (member.partial)
    member = await member.fetch();

  const { client: Muki, guild, user } = member;

  const config = database.get(guild.id);
  if (!config) return console.log(`Por alguna razón la guild ${guild.name} no tenia entrada de configuración. (EHandler/Guild/memberAdd)`);

  if (config.welcome.enabled) {

    //channelID should be either a valid id string or null.
    const channel = Muki.channels.cache.get(config.welcome.channelID);

    //If channel comes undefined
    if (!channel) return guild.systemChannel.send(salida(user, config)).catch(err => console.log(`La guild ${guild.name} no tiene canal de bienvenida, ni canal de sistema.`));

    else return channel.send(salida(user, config));

  }
  else return undefined;
}

const salida = (user = new User(), config) => {
  const { client: Muki } = user;
  const crab = Muki.emojis.cache.find(emoji => emoji.name == 'crabb');

  const frases = config.welcome.leavePhrases;

  let frase = "";

  if (frases.length > 0) frase = frases[Math.floor(Math.random() * frases.length)];

  return new MessageEmbed()
    .setTitle(`⬅ ¡${user.tag} ha abandonado el servidor!`)
    .setDescription(`${frase} ${crab}`)
    .setColor("RED")
    .setThumbnail(user.displayAvatarURL({ size: 512 }))
}