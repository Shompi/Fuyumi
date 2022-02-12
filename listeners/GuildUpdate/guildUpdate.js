const { Listener } = require('discord-akairo');
const { Guild, TextChannel, MessageEmbed, Util } = require('discord.js');
const { GuildModel } = require('../../Schemas/Guild.js');

class GuildUpdateListener extends Listener {
  constructor() {
    super('guildUpdate', {
      emitter: 'client',
      event: 'guildUpdate'
    });
  }

  /**
   * 
   * @param {Guild} oldGuild 
   * @param {Guild} newGuild 
   */
  async exec(oldGuild, newGuild) {
    updateGuildOnDB(newGuild);
  }
}

/** @param {Guild} guild */
async function updateGuildOnDB(guild) {

  console.log(`Actualizando guild ${guild.name} ${guild.id}...`);
  await GuildModel.findOneAndUpdate(
    { id: guild.id },
    {
      id: guild.id,
      name: guild.name,
      iconURL: guild.iconURL(),
      memberCount: guild.memberCount,
      channelCount: guild.channels.cache.size,
      owner: {
        tag: guild.client.users.cache.get(guild.ownerId).username ?? "- -",
        avatarURL: guild.client.users.cache.get(guild.ownerId).displayAvatarURL()
      }
    },
    {
      upsert: true
    });
  console.log(`La guild ${guild.name} ha sido actualizada.`);
}

module.exports = GuildUpdateListener;