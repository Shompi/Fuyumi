const { MessageEmbed, GuildMember, Client, User } = require('discord.js');
const database = require('../../../LoadDatabase').guildConfigs;

//guildMemberAdd (GuildMember)
module.exports = async (member = new GuildMember(), Muki = new Client()) => {

  const { guild, user } = member;
  if (user.bot) return undefined;
  const config = database.get(guild.id);
  if (!config) return console.log(`Por alguna razón la guild ${guild.name} no tenia entrada de configuración. (EHandler/Guild/memberAdd)`);

  if (config.welcome.enabled) {
    
    //channelID should be either a valid id string or null.
    const channel = Muki.channels.cache.get(config.welcome.channelID);

    //If channel comes undefined
    if (!channel) return await guild.systemChannel.send(bienvenida(user, config)).catch(err => console.log(`La guild ${guild.name} no tiene canal de bienvenida, ni canal de sistema.`));
    
    else return await channel.send(bienvenida(user, config));

  }
  else return undefined;
}

const bienvenida = (user = new User(), config) => {
  const frases = config.welcome.joinPhrases;
  let frase = "";
  if (frases.length > 0) frase = frases[Math.floor(Math.random() * frases.length)];

  return new MessageEmbed()
    .setTitle(`¡${user.tag} se ha unido al servidor!`)
    .setDescription(frase)
    .setColor("GREEN")
    .setTimestamp()
    .setThumbnail(user.displayAvatarURL({ size: 512 }))
}