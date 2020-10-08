const { VoiceState, MessageEmbed } = require('discord.js');
const TWOHOURS = 1000 * 60 * 60 * 2; // 2 Horas.


module.exports = async (old = new VoiceState(), now = new VoiceState()) => {
  try {
    if (now.member.partial)
      await member.fetch();


    if (now.streaming) {
      const { client } = now;
      let newuser = false;

      console.log("GO LIVE");
      if (!client.db.GoLive.has(now.member.id)) {
        client.db.GoLive.set(now.member.id, Date.now());
        newuser = true;
      }

      const timediff = Date.now() - client.db.GoLive.get(now.member.id);
      console.log(`Timediff: ${timediff}`);
      if (timediff < TWOHOURS && !newuser) return;

      const livestreamChannel = now.guild.channels.cache.find(channel => channel.type === "text" && channel.name === "directos");

      if (!livestreamChannel) return;

      const game = now.member.presence.activities.find(activity => activity.type !== "CUSTOM_STATUS") || { name: "Actividad Desconocida" };
      const defaultGame = "Actividad Desconocida";

      const gameImage = client.db.gameImages.get(game.name);

      const embed = new MessageEmbed()
        .setThumbnail(now.member.user.displayAvatarURL({ size: 512, dynamic: true }))
        .setTitle(`¡${now.member.displayName} ha comenzado a transmitir ${game.name || defaultGame} en el canal ${now.channel.name}!`)
        .setImage(gameImage);

      
      livestreamChannel.send(embed);
    }

  } catch (error) {
    console.error(error);
  }
}