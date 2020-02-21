const { Message, MessageEmbed, GuildMember } = require('discord.js');

const MicMute = async (message = new Message(), target = new GuildMember(), reason = undefined) => {
  try {
    
    if (message.guild.me.hasPermission('MUTE_MEMBERS')) {
      if (!target || !target.voice.channel) return await message.reply("El usuario no es parte de esta guild, o no está en ningún canal de voz.");
      if (target.voice.serverMute) return await target.voice.setMute(false, reason)
        .then(gm => message.channel.send(`He desmuteado a **<@${gm.id}>!**`));

      const mutedMember = await target.voice.setMute(true, reason);
      await message.channel.send(`He silenciado exitosamente a ${mutedMember.displayName}\n\nNo olvides desmutearlo mas tarde!`);
      const infoEmbed = new MessageEmbed()
        .setThumbnail(message.author.displayAvatarURL({ size: 256 }))
        .setColor("RED")
        .setTitle(`${message.author.tag} te ha silenciado en ${message.guild.name}!`)
        .setDescription(`**Motivo:** ${reason || "Sin motivo."}\nHablale para que te desmutee!`)
        .setTimestamp();
      return await mutedMember.send(infoEmbed).catch(error => message.reply("no puedo enviarle mensajes a este usuario."));

    } else return await message.reply("necesito el permiso '**MUTE MEMBERS**' para ejecutar este comando.");
  }
  catch (error) {
    console.log(error);
  }
}



module.exports = { MicMute }