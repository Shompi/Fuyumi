const { Guild, Collection } = require('discord.js');
const { GuildModel } = require('../../../Schemas/Guild.js')
/**
 * 
 * @param {Collection<string, Guild} guilds 
 */
module.exports.saveGuilds = async (guilds) => {

  try {
    for (const [id, guild] of guilds) {
      const isOnDb = await GuildModel.findOne({ id: guild.id })

      if (isOnDb) {
        console.log(`Guild ${guild.name} is already on db.`);
        continue;
      }

      console.log(`Adding ${guild.name} to the database...`);
      await GuildModel.create({
        id,
        name: guild.name,
        iconURL: guild.iconURL(),
        memberCount: guild.memberCount,
        channelCount: guild.channels.cache.size,
        owner: {
          tag: guild.client.users.cache.get(guild.ownerId).username ?? '- -',
          avatarURL: guild.client.users.cache.get(guild.ownerId).displayAvatarURL() ?? "- -"
        }
      }).catch(err => {
        console.log(`No se pudo guardar la Guild ${guild.name} ${id} en la database`);
        console.log(err);
      });

      console.log(`${guild.name} has been added to the database!`);
    }

    const count = await GuildModel.find()

    console.log(`The database has ${count.length} entries!`)
  } catch (err) {
    console.log(err);
  }

}