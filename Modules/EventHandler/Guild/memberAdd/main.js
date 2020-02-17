const { MessageEmbed, GuildMember, Client, User } = require('discord.js');
const database = require('../../../LoadDatabase').guildConfigs;

//guildMemberAdd (GuildMember)
module.exports = async (member = new GuildMember(), Muki = new Client()) => {

  const { guild, user } = member;
  if (user.bot) return undefined;
  const configs = database.get(guild.id);
  if (!configs) return console.log(`Por alguna razón la guild ${guild.name} no tenia entrada de configuración. (EHandler/Guild/memberAdd)`);

  if (config.welcome.enabled) {
    
    //channelID should be either a valid id string or null.
    const channel = Muki.channels.cache.get(configs.welcome.channelID);

    //If channel comes undefined
    if (!channel) return await guild.systemChannel.send(bienvenida(user, configs)).catch(err => console.log(`La guild ${guild.name} no tiene canal de bienvenida, ni canal de sistema.`));
    
    else return await channel.send(bienvenida(user, configs));

  }
  else return undefined;
}

const bienvenida = (user = new User(), configs) => {
  const frases = configs.welcome.joinPhrases;
  let frase = "";
  if (frases.length > 0) frase = frases[Math.floor(Math.random() * frases.length)];

  return new MessageEmbed()
    .setTitle(`¡${user.tag} se ha unido al servidor!`)
    .setDescription(frase)
    .setColor("GREEN")
    .setTimestamp()
    .setThumbnail(user.displayAvatarURL({ size: 512 }))
}