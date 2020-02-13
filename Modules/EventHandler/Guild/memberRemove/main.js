const { MessageEmbed, GuildMember, Client } = require('discord.js');
const Leave = require('../../../../Frases/leave');
module.exports = async (member = new GuildMember(), Muki = new Client()) => {
  if (member.partial) {
    member = await member.fetch();
  }

  if (!member.guild) return;
  if (member.guild.id != '537484725896478733') return;
  //Check auditlogs
  /* Muki.guilds.get('537484725896478733').fetchAuditLogs({limit:1}).then(logs => {
    log = logs.entries.first();
  } */
  const emoji = Muki.emojis.cache.find(emoji => emoji.name == 'crabb');
  const frase = Leave[Math.floor(Math.random() * Leave.length)];
  const embed = new MessageEmbed()
    .setTitle(`${member.user.tag} ha dejado el servidor ${emoji}`)
    .setColor('RED')
    .setDescription(frase)
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .setTimestamp();

  await Muki.channels.cache.get('645834668947537940').send(embed).catch(console.error); //#entrada-salida
}