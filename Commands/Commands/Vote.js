const { MessageEmbed, Message } = require('discord.js');
const votecount = require('../LoadDatabase').votes;
const cooldowns = require('../LoadDatabase').votesCooldown;
const MINUTE = 1000 * 60;
const approvedimage = 'https://puu.sh/EPc3r/6dfaa029d1.png';
const rejectedimage = 'https://puu.sh/EPc4k/ed4ca4cfc3.png';
const neutralimage = 'https://puu.sh/EPcbj/d8fd38a401.png';
const inProgress = 'https://puu.sh/EPcok/0c349a8d0f.png';
const noVoteImage = 'https://puu.sh/EPe4V/e12a2b7355.png';
const path = require('path');

module.exports = {
  name: "vote",
  filename: path.basename(__filename),
  description: "Inicia una votación en el servidor. Solo se permite una votación en curso.",
  usage: "vote [Tiempo en minutos] [Pregunta / Propuesta]",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],

  async execute(message = new Message(), args = new Array()) {
    const { guild, channel, author, member } = message;

    if (cooldowns.has(guild.id)) return await message.reply('Ya hay una votación en progreso.');

    if (!votecount.has(guild.id)) votecount.set(guild.id, 1);

    if (isNaN(args[0])) return await channel.send('No se pudo iniciar la votación. Error: Tiempo inválido.');

    let time = args.shift() * 1000 * 60; //Mínimo un minuto
    if (time < MINUTE) return await message.reply('No puedes comenzar una votación con una duración menor a 1 minuto.');

    const timestamp = Date.now(); //Timestamp in milliseconds

    const question = args.join(' ');

    const voteEmbed =
      new MessageEmbed()
        .setAuthor(`¡${author.tag} ha iniciado una votación!`, author.displayAvatarURL({ size: 64 }))
        .setColor(member.displayColor)
        .setTitle(question)
        .setDescription(`\n\nFinaliza en ${time / 1000 / 60} minutos`)
        .setFooter(`Votación número: ${votecount.get(guild.id)}`)
        .setThumbnail(inProgress);


    if (message.attachments.size >= 1) {
      const attach = message.attachments.first().url;
      if (attach.endsWith('jpeg') || attach.endsWith('jpg') || attach.endsWith('png'))
        voteEmbed.setImage(attach);
    }

    channel.send(voteEmbed)
      .then(async vote => {

        message.delete({ timeout: 10000 });
        votecount.inc(vote.guild.id);
        cooldowns.set(guild.id, "foo");
        //await db.set(message.author.id, 'cooldown', 1000 * 60); // 1 minute cooldown
        //await votedb.set('lastvote', votenumber);

        await vote.react('✅').catch(error => console.log(error));
        await vote.react('❌').catch(error => console.log(error));
        await vote.react('😐').catch(error => console.log(error));
        await vote.react('🚫').catch(error => console.log(error));

        const cancelfilter = (reaction, user) => reaction.emoji.name === '🚫' && user.id == author.id;

        vote.createReactionCollector(cancelfilter, { max: 1, time: time })
          .on('collect', async (reaction, user) => {
            votecount.dec(guild.id);
            cooldowns.delete(guild.id);
            const canceled = new MessageEmbed().setTitle(`❌ La votación ha sido cancelada.`).setColor("RED");
            return await channel.send(canceled);
          });

        const filter = (reaction, user) => reaction.emoji.name == '✅' || reaction.emoji.name == '❌' || reaction.emoji.name == '😐' && user.id !== '552272683543560194';

        //The vote has finished.
        await vote.awaitReactions(filter, { time: time })
          .then(async collected => {

            cooldowns.delete(guild.id);

            const yes = collected.get('✅');
            const no = collected.get('❌');
            const neutros = collected.get('😐');

            let yesUsers, noUsers, neutralUsers, yesCount, noCount, neutralCount;

            if (!yes) yesCount = 0;
            else {
              yesUsers = yes.users.cache.filter(user => !user.bot).map(user => user.tag);
              yesCount = yes.count - 1;
            }
            if (!no) noCount = 0;
            else {
              noUsers = no.users.cache.filter(user => !user.bot).map(user => user.tag);
              noCount = no.count - 1;
            }
            if (!neutros) neutralCount = 0;
            else {
              neutralUsers = neutros.users.cache.filter(user => !user.bot).map(user => user.tag);
              neutralCount = neutros.count - 1;
            }

            voteEmbed.setDescription(`**A favor:** ${yesCount}\t**En contra:** ${noCount}\t**Neutros:** ${neutralCount}`)
              .setAuthor(`¡La votación de ${author.tag} ha finalizado!`, author.displayAvatarURL({ size: 64 }))
              .addField('A FAVOR:', `${yesUsers ? `${yesUsers.join('\n')}` : "Nadie."}`, true)
              .addField('EN CONTRA:', `${noUsers ? `${noUsers.join('\n')}` : "Nadie."}`, true)
              .addField('NEUTRO:', `${neutralUsers ? `${neutralUsers.join('\n')}` : "Nadie."}`, true)

            if (yesCount == 0 && noCount == 0 && neutralCount == 0) voteEmbed.setFooter('La votación ha sido anulada debido a que nadie ha votado.').setColor('BLUE').setThumbnail(noVoteImage).setTitle(`${question} [ANULADA]`);
            else if (neutralCount > yesCount && neutralCount > noCount) voteEmbed.setColor(member.displayColor).setFooter(`La decisión quedará a discreción de ${author.tag}`).setThumbnail(author.displayAvatarURL({ size: 256 })).setTitle(`${question} [PENDIENTE]`);
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
}
