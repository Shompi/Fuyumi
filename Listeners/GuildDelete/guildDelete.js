const { Listener } = require('discord-akairo');
const { Guild, TextChannel, EmbedBuilder, Colors } = require('discord.js');

class GuildDeleteListener extends Listener {
  constructor() {
    super('guildDelete', {
      emitter: 'client',
      event: 'guildDelete'
    });
  }

  /**
   * 
   * @param {Guild} guild 
   */
  async exec(guild) {

    /** @type {TextChannel} */
    const channel = this.client.getPrivateChannel();

    if (!channel)
      return console.log(`Muki ha abandonado la guild ${guild.name} (${guild.id}), Miembros: ${guild.memberCount}`);

    else {
      return await channel.send({
        embeds: [new EmbedBuilder()
          .setTitle(`Guild Abandonada: ${guild.name}`)
          .setColor(Colors.Red)
          .setDescription(`Miembros: ${guild.memberCount}\nId: ${guild.id}`)]
      });
    }
  }
}

module.exports = GuildDeleteListener;