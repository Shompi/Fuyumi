const { MessageEmbed, GuildMember, Client } = require('discord.js');
const Join = require('../../../../Frases/join');
module.exports = async (member = new GuildMember(), Muki = new Client()) => {
  switch (member.guild.id) {
    case '537484725896478733':
      //Exiliados
      const frase = Join[Math.floor(Math.random() * Join.length)];
      const exiliadosEmbed = new MessageEmbed()
        .setTitle(`${member.user.tag} ha entrado al servidor!`)
        .setDescription(frase)
        .setColor('GREEN')
        .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
        .setTimestamp();
      await Muki.channels.get('645834668947537940').send(exiliadosEmbed).catch(console.error); //#bienvenida
      if (member.user.bot) await member.roles.add("545773830170214440", "BOT").catch(console.error);

      break;
    case '514256051902611457':
      //Austral Community
      if (member.user.bot) return await member.roles.add("548329579945787402", "BOT");
      const australEmbed = new MessageEmbed()
        .setTitle(`Bienvenido a ${member.guild.name} ${member.user.tag}!`)
        .setThumbnail(member.user.displayAvatarURL({size:512}))
        .setFooter(`Eres el miembro #${member.guild.memberCount} en ${member.guild.name}!`)
        .setColor('BLUE')
        .setTimestamp();
      await member.roles.add('548325706183082009', 'Usuario nuevo.').catch(console.error);
      await Muki.channels.get('514256051902611459').send(australEmbed).catch(console.error);
      break;
  }
}