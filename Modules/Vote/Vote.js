const { MessageEmbed, Message } = require('discord.js');
const votes = require('../LoadDatabase').votes;
const minute = 1000 * 60;
const approvedimage = 'https://puu.sh/EPc3r/6dfaa029d1.png';
const rejectedimage = 'https://puu.sh/EPc4k/ed4ca4cfc3.png';
const neutralimage = 'https://puu.sh/EPcbj/d8fd38a401.png';
const inProgress = 'https://puu.sh/EPcok/0c349a8d0f.png';
const noVoteImage = 'https://puu.sh/EPe4V/e12a2b7355.png';

module.exports = async (message = new Message(), content = new String()) => {

  let cooldown;
  if (cooldown) return await message.reply('debes esperar un minimo de 60 segundos antes de iniciar otra votación.');
  let votenumber = await votedb.get('lastvote');
  if (!votenumber) {
    votenumber = { count: 1 }
  }

  let args = content.split(' ');
  if (isNaN(args[0])) {
    message.delete({ timeout: 5000, reason: `bad formatted voting. ${message.author.tag}` });
    return await message.channel.send('No se pudo iniciar la votación. Error: Tiempo inválido.').then(msg => msg.delete({ timeout: 10000 }));
  }

  let time = args.shift() * 1000 * 60; //Mínimo un minuto
  if (time < minute) {
    message.delete({ timeout: 5000, reason: 'voting less than a minute' }).catch(err => console.log(err));
    return await message.reply('No puedes comenzar una votación con una duración menor a 1 minuto.').then(msg => msg.delete({ timeout: 10000 }));
  }
  const timestamp = Date.now(); //Timestamp in milliseconds
  const question = args.join(' ');
  const voteEmbed = new MessageEmbed()
    .setAuthor(`¡${message.author.tag} ha iniciado una votación!`, message.author.displayAvatarURL({ size: 64 }))
    .setColor(message.member.displayColor)
    .setTitle(question)
    .setDescription(`\n\nFinaliza en ${time / 1000 / 60} minutos`)
    .setFooter(`Votación número: ${votenumber.count}`)
    .setThumbnail(inProgress);

  message.channel.send(voteEmbed)
    .then(async vote => {


      message.delete({ timeout: 2000 }).catch(error => console.log(error));
      votenumber.count++;
      //await db.set(message.author.id, 'cooldown', 1000 * 60); // 1 minute cooldown
      //await votedb.set('lastvote', votenumber);

      await vote.react('✅').catch(error => console.log(error));
      await vote.react('❌').catch(error => console.log(error));
      await vote.react('😐').catch(error => console.log(error));
      await vote.react('🚫').catch(error => console.log(error));
      const cancelfilter = (reaction, user) => reaction.emoji.name === '🚫' && user.id == message.author.id;
      vote.createReactionCollector(cancelfilter, {max:1, time: time})
        .on('collect', async (reaction, user) => {
          let votenumber = "#DefaultValue"; //await votedb.get('lastvote');
          votenumber.count--;
          //await votedb.set('lastvote', votenumber);
          await message.channel.send('La votación ha sido cancelada.');
          return vote.delete({timeout:2000, reason:'La votación fue cancelada por el usuario ' + message.author.tag}).catch(err => console.log(err));
        })
      const filter = (reaction, user) => reaction.emoji.name == '✅' || reaction.emoji.name == '❌' || reaction.emoji.name == '😐' && user.id !== '552272683543560194';
      await vote.awaitReactions(filter, { time: time })
        .then(async collected => {

          const yes = collected.get('✅');
          const no = collected.get('❌');
          const neutros = collected.get('😐');

          let yesUsers, noUsers, neutralUsers, yesCount, noCount, neutralCount;

          if (!yes) yesCount = 0;
          else {
            yesUsers = yes.users.filter(user => !user.bot).map(user => user.tag);
            yesCount = yes.count - 1;
          }
          if (!no) noCount = 0;
          else {
            noUsers = no.users.filter(user => !user.bot).map(user => user.tag);
            noCount = no.count - 1;
          }
          if (!neutros) neutralCount = 0;
          else {
            neutralUsers = neutros.users.filter(user => !user.bot).map(user => user.tag);
            neutralCount = neutros.count - 1;
          }

          voteEmbed.setDescription(`**A favor:** ${yesCount}\t**En contra:** ${noCount}\t**Neutros:** ${neutralCount}`)
            .setAuthor(`¡La votación de ${message.author.tag} ha finalizado!`, message.author.displayAvatarURL({ size: 64 }))
            .addField('A FAVOR:', `${yesUsers ? `${yesUsers.join('\n')}` : "Nadie."}`, true)
            .addField('EN CONTRA:', `${noUsers ? `${noUsers.join('\n')}` : "Nadie."}`, true)
            .addField('NEUTRO:', `${neutralUsers ? `${neutralUsers.join('\n')}` : "Nadie."}`, true)

          if (yesCount == 0 && noCount == 0 && neutralCount == 0) voteEmbed.setFooter('La votación ha sido anulada debido a que nadie ha votado.').setColor('BLUE').setThumbnail(noVoteImage).setTitle(`${question} [ANULADA]`);
          else if (neutralCount > yesCount && neutralCount > noCount) voteEmbed.setColor(message.member.displayColor).setFooter(`La decisión quedará a discreción de ${message.author.tag}`).setThumbnail(message.author.displayAvatarURL({ size: 256 })).setTitle(`${question} [PENDIENTE]`);
          else if (yesCount > noCount) voteEmbed.setColor('GREEN').setThumbnail(approvedimage).setTitle(`${question} [APROBADA]`);
          else if (yesCount < noCount) voteEmbed.setColor('RED').setThumbnail(rejectedimage).setTitle(`${question} [RECHAZADA]`);
          else if (yesCount == noCount) voteEmbed.setColor('YELLOW').setThumbnail(neutralimage).setTitle(`${question} [EMPATE]`);
          else voteEmbed.setColor('BLUE').setFooter('La votación ha terminado con un resultado desconocido').setTitle(`${question} [DESCONOCIDO]`);
          voteEmbed.setTimestamp();
          await vote.edit(null, { embed: voteEmbed }).catch(err => console.log("El mensaje fue eliminado o no se puede editar."));
        })

      return console.log('La votación ha terminado.');
    })
}
