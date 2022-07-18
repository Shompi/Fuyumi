const { Listener } = require('discord-akairo');
const { EmbedBuilder, Colors, GuildMember } = require('discord.js');

class GuildMemberAddListener extends Listener {
  constructor() {
    super('guildMemberAdd', {
      emitter: 'client',
      event: 'guildMemberAdd'
    });
  }

  /**
   * 
   * @param {GuildMember} member 
   */
  async exec(member) {

    if (member.guild.id !== '537484725896478733')
      return;

    const content = `¡Bienvenido ${member}! Puedes asignarte roles en <#865360481940930560>`;
    const embed = new EmbedBuilder()
      .setTitle(`¡Bienvenido a ${member.guild.name} ${member.displayName}!`)
      .setDescription(`Eres el miembro N°**${member.guild.memberCount}**`)
      .setColor(Colors.Blue)
      .setTimestamp();

    return await member.guild.systemChannel.send({ content, embeds: [embed] }).catch(console.error);
  }
}

module.exports = GuildMemberAddListener;