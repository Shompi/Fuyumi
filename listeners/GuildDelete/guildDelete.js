const { Listener } = require('discord-akairo');
const { Guild, TextChannel, MessageEmbed, Util } = require('discord.js');
const { GuildModel } = require('../../Schemas/Guild.js');

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


    removeGuildFromDB(guild);

    /** @type {TextChannel} */
    const channel = this.client.getPrivateChannel();

    if (!channel)
      return console.log(`Muki ha abandonado la guild ${guild.name} (${guild.id}), Miembros: ${guild.memberCount}`);

    else {
      return await channel.send({
        embeds: [new MessageEmbed()
          .setTitle(`Guild Abandonada: ${guild.name}`)
          .setColor(Util.resolveColor('RED'))
          .setDescription(`Miembros: ${guild.memberCount}\nId: ${guild.id}`)]
      });
    }
  }
}

/** @param {Guild} guild */
async function removeGuildFromDB(guild) {

  const isOnDB = await GuildModel.findOne({ id: guild.id });

  if (isOnDB) {
    console.log(`Eliminado guild ${guild.name} ${guild.id} por abandono...`);
    await GuildModel.deleteOne({ id: guild.id });
    console.log(`La guild ${guild.name} ha sido eliminada de la base de datos.`);
  }

  console.log(`La guild ${guild.name} ha sido abandonada.`);
}

module.exports = GuildDeleteListener;