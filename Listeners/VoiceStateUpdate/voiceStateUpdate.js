//@ts-check
const { Listener } = require('discord-akairo');
const { VoiceState, Activity, EmbedBuilder, TextChannel } = require('discord.js');
const { getGameCoverByName } = require('../../GameImages/index');
const Timeouts = new Set();


class InteractionEvent extends Listener {
  constructor() {
    super('voiceStateUpdate', {
      emitter: 'client',
      event: 'voiceStateUpdate'
    });
  }

  /**
  * @param {VoiceState} oldState
  * @param {VoiceState} newState
  * 
  */
  async exec(oldState, newState) {

    return; // Disabling this for now, may come back later.
    if (newState.guild.id !== "537484725896478733" || Timeouts.has(newState.member.id)) return;

    if (oldState.streaming) return;
    if (newState.streaming && !oldState.streaming) {

      if (!newState.member)
        return;

      // Obtener el juego o actividad siendo stremeada, usaremos "find" para encontrar una activiad en estado "PLAYING"
      /**@type {Activity} */

      const activity = newState.member.presence?.activities?.find(activity => activity.type === 'PLAYING');

      const thumbnailUrl = await getGameCoverByName(activity?.name ?? 'Actividad Desconocida');

      const liveEmbed = new EmbedBuilder()
        .setTitle(`${newState.member.user.tag} ha comenzado a transmitir en ${newState.channel.name}!`)
        .setDescription(`**${activity?.name ?? ""} - ${activity?.state ?? ""}**`)
        .setThumbnail(newState.member.displayAvatarURL({ size: 512, dynamic: true }))
        .setImage(thumbnailUrl)
        .setColor(newState.member.displayColor);

      /**@type {TextChannel} */
      const streamingChannel = newState.client.channels.cache.get("600159867239661578");

      streamingChannel.send({ embeds: [liveEmbed] });

      Timeouts.add(newState.member.id);

      setTimeout(() => {
        Timeouts.delete(newState.member.id);
      }, 1000 * 60 * 30);
    }
  }
}


module.exports = InteractionEvent;