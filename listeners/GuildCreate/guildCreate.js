const { Listener } = require('discord-akairo');
const { Guild, TextChannel, MessageEmbed } = require('discord.js');

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

    /**
     * @type {TextChannel}
     */
    const channel = this.client.getPrivateChannel();

    if (!channel)
      return console.log(`Muki ha entrado a la guild ${guild.name} (${guild.id}), Miembros: ${guild.memberCount}`);

    else {
      return await channel.send({
        embeds: [new MessageEmbed().setTitle(`Nueva guild: ${guild.name}`).setColor('BLUE').setDescription(`Miembros: ${guild.memberCount}\nId: ${guild.id}`)]
      });
    }
  }
}

module.exports = GuildCreateListener;