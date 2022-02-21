const { Listener } = require('discord-akairo');
const { Guild, TextChannel, MessageEmbed, Util } = require('discord.js');
const { GuildModel } = require('../../Schemas/Guild.js');

class GuildCreateListener extends Listener {
  constructor() {
    super('guildCreate', {
      emitter: 'client',
      event: 'guildCreate'
    });
  }

  /**
   * 
   * @param {Guild} guild 
   */
  async exec(guild) {


    addGuildToDB(guild);
    const owner = await guild.fetchOwner();

    /** @type {TextChannel} */
    const channel = this.client.getPrivateChannel();

    if (!channel)
      return console.log(`Muki ha entrado a la guild ${guild.name} (${guild.id}), Miembros: ${guild.memberCount}`);

    else {
      return await channel.send({
        embeds: [new MessageEmbed()
          .setTitle(`Nueva guild: ${guild.name}`)
          .setColor(Util.resolveColor('BLUE'))
          .setDescription(`Miembros: ${guild.memberCount}\nId: ${guild.id}\nOwner: ${owner.tag} ${owner.id}`)
          .setThumbnail(guild.iconURL())]
      });
    }
  }
}

/** @param {Guild} guild */
async function addGuildToDB(guild) {

  const isOnDB = await GuildModel.findOne({ id: guild.id });

  if (isOnDB)
    return console.log(`${guild.client.user.username} entró a la guild ${guild.name} ${guild.id} pero esta guild ya estaba en la base de datos.`);

  else {
    await GuildModel.create({
      id: guild.id,
      name: guild.name,
      iconURL: guild.iconURL(),
      memberCount: guild.memberCount,
      channelCount: guild.channels.cache.size,
      owner: {
        tag: guild.client.users.cache.get(guild.ownerId).username ?? '- -',
        avatarURL: guild.client.users.cache.get(guild.ownerId).displayAvatarURL()
      }
    });
  }

  console.log(`La guild ${guild.name} ${guild.id} ha sido agregada a la base de datos!`);
}

module.exports = GuildCreateListener;