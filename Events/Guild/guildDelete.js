const { Guild } = require('discord.js');
const { basename } = require('path');


module.exports = {
  name: "guildDelete",
  filename: basename(__filename),
  path: __filename,
  hasTimers: false,
  /**
  *@param {Guild} guild
  */
  execute(guild) {
    /*Code Here*/
    const { client } = guild;

    const leavedGuild = new MessageEmbed()
      .setAuthor(`${guild.name} (${guild.id})`, guild.iconURL({ size: 64 }))
      .setDescription(`Miembros: ${guild.memberCount}\nDueño: ${guild.owner.user.tag} (${guild.ownerID})\nCanales: ${guild.channels.cache.size}`)
      .setFooter("GUILD_DELETE")
      .setColor("ORANGE");

    return client.channels.cache.get("585990511790391309").send(leavedGuild);
  }
}