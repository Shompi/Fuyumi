const { MessageEmbed, GuildMember, Client, User } = require('discord.js');
const { basename } = require('path');

/**@param {User} user */
const bienvenida = (user, config) => {
  const frases = config.welcome.joinPhrases;
  let frase = "";
  if (frases.length > 0) frase = frases[Math.floor(Math.random() * frases.length)];

  return new MessageEmbed()
    .setTitle(`➡ ¡${user.tag} se ha unido al servidor!`)
    .setDescription(frase)
    .setColor("GREEN")
    .setThumbnail(user.displayAvatarURL({ size: 512 }))

}

module.exports = {
  name: "guildMemberAdd",
  filename: basename(__filename),
  path: __filename,
  hasTimers: false,
  /**
  *@param {GuildMember} member
  */
  execute(member) {
    /*Code Here*/
    const { guild, user, client: Muki } = member;
    if (user.bot) return undefined;
    const config = Muki.db.guildConfigs.get(guild.id);
    if (!config) return console.log(`Por alguna razón la guild ${guild.name} no tenia entrada de configuración. (EHandler/Guild/memberAdd)`);

    if (config.welcome.enabled) {

      //channelID should be either a valid id string or null.
      const channel = Muki.channels.cache.get(config.welcome.channelID);

      //If channel comes undefined
      if (!channel && !guild.systemChannel)
        return

      else return channel.send(bienvenida(user, config));
    }
  }
}
