const { Listener } = require('discord-akairo');
const { Guild, TextChannel, EmbedBuilder, Colors } = require('discord.js');

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
    const owner = await guild.fetchOwner();

    /** @type {TextChannel} */
    const channel = this.client.getPrivateChannel();

    if (!channel)
      return console.log(`Muki ha entrado a la guild ${guild.name} (${guild.id}), Miembros: ${guild.memberCount}`);

    else {
      return await channel.send({
        embeds: [new EmbedBuilder()
          .setTitle(`Nueva guild: ${guild.name}`)
          .setColor(Colors.Blue)
          .setDescription(`Miembros: ${guild.memberCount}\nId: ${guild.id}\nOwner: ${owner.user.tag} ${owner.id}`)
          .setThumbnail(guild.iconURL())]
      });
    }
  }
}

module.exports = GuildCreateListener;