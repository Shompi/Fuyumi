const { Guild, Collection } = require('discord.js');
const { Model } = require('mongoose');
/**
 * 
 * @param {Collection<String, Guild>} guilds 
 * @param {Model} GuildModel
 */
module.exports.saveGuilds = async (guilds, GuildModel) => {
  try {

    for (const [id, guild] of guilds) {
      const isOnDb = await GuildModel.findOne({ id: guild.id })

      if (isOnDb) {
        console.log(`La guild ${guild.name} ya estaba en la base de datos.`);
        continue;
      }

      console.log(`Añadiendo ${guild.name} a la base de datos...`);
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

      console.log(`¡${guild.name} ha sido añadida a la base de datos!`);
    }
    const count = await GuildModel.find()
    console.log(`La base de datos tiene ${count.length} entradas!`)
  } catch (err) {
    console.log("Ocurrió un error en la base de datos");
    console.log("Razón:", err);
    console.log("Intenando nuevamente...");
    this.saveGuilds(guilds);
  }
}