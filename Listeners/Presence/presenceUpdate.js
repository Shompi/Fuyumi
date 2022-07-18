//@ts-check
const { Presence, Activity, EmbedBuilder, TextChannel, GuildMember } = require('discord.js');
const { Listener } = require('discord-akairo');
const keyv = require('keyv');
const LIVESTREAMS_TIMESTAMPS = new keyv('sqlite://database.sqlite', { namespace: 'livestreams' });
const StreamsConfigPerGuild = new keyv('sqlite://StreamsConfigs.sqlite', { namespace: 'streamsConfig' });

const HOURSLIMIT = 1000 * 60 * 60 * 3;
const { getGameCoverByName } = require('../../GameImages/index');

class PresenceUpdateListener extends Listener {
  constructor() {
    super('presenceUpdate', {
      emitter: 'client',
      event: 'presenceUpdate'
    });

    this.hasTimers = false;

    /**
     * 
     * @param {Presence} presence 
     * @param {Presence} _old 
     */

    this.checkTwitchStream = async (presence, _old) => {

      /**@param {string} guildId*/
      const checkGuildConfigs = async (guildId) => {

        /**
         * @type {{ roleId: string, channelId: string, enabled: boolean }}
         */
        const configs = await StreamsConfigPerGuild.get(guildId);
        if (!configs) return false;
        if (!configs.enabled) return false;

        return true;
      }

      /**
      * @param {GuildMember} member 
      */
      const memberHasStreamerRole = async (member) => {
        const StreamerRoleId = await StreamsConfigPerGuild.get(member.guild.id).then(configs => configs ? configs.roleId : "0000");
        return member.roles.cache.has(StreamerRoleId);
      }

      /**
      * @param {Presence} presence
      */
      const getLivestreamInfo = (presence) => presence.activities.find(activity => activity.type === 'STREAMING');

      /**
      * @param {Activity} activity
      * @param {GuildMember} member
      */
      const createEmbed = async (activity, member) => {

        // @ts-ignore
        const gameImage = await getGameCoverByName(activity.state);

        return new EmbedBuilder()
          .setAuthor({
            name: `¡${member.displayName} ha comenzado a transmitir en ${activity.name}!`,
            url: activity.url
          })
          .setTitle(activity.details)
          .setDescription(`[-> Únete a la transmisión <-](${activity.url})`)
          .setColor(member.displayColor)
          .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
          .setImage(gameImage);
      }

      /**
      * @param {Presence} presence
      */
      const sendLiveStream = async (presence) => {

        const streamChannelId = await StreamsConfigPerGuild.get(presence.guild.id).then(configs => configs ? configs.channelId : "0000");

        /**
        * @type {TextChannel}
        */
        const STREAM_CHANNEL = presence.client.channels.cache.get(streamChannelId);

        STREAM_CHANNEL.send({
          embeds: [await createEmbed(STREAMED_ACTIVITY, presence.member)]
        });
      }
      //************ */

      // Chequear que haya una actividad siendo stremeada
      const STREAMED_ACTIVITY = getLivestreamInfo(presence);

      if (!STREAMED_ACTIVITY) return;

      if (!(await checkGuildConfigs(presence.guild.id))) return;
      if (!(await memberHasStreamerRole(presence.member))) return;

      let USER_TIMESTAMP = await LIVESTREAMS_TIMESTAMPS.get(presence.user.id).catch(() => null);
      let NEW_USER = false;

      if (!USER_TIMESTAMP) {
        // Si el usuario no está lo agregamos
        await LIVESTREAMS_TIMESTAMPS.set(presence.user.id, Date.now());
        USER_TIMESTAMP = await LIVESTREAMS_TIMESTAMPS.get(presence.user.id);
        NEW_USER = !NEW_USER;
      }


      if (NEW_USER) {

        sendLiveStream(presence);

      } else {
        // Revisar si han pasado las horas necesarias desde que el usuario comenzó a transmitir
        const TIMENOW = Date.now();

        const TIMEDIFF = TIMENOW - USER_TIMESTAMP;
        if (TIMEDIFF >= HOURSLIMIT) {
          sendLiveStream(presence);
          // Update timestamp
          await LIVESTREAMS_TIMESTAMPS.set(presence.user.id, Date.now());
        } else return;
      }
    }
  }
  /**
  *@param {Presence} old
  *@param {Presence} now
  */
  async exec(old, now) {
    /*Code Here*/

    /* Esto solo funcionará para exiliados */
    if (now.guild?.id === '537484725896478733') {
      this.checkTwitchStream(now, old);
    }
  }
}
module.exports = PresenceUpdateListener;