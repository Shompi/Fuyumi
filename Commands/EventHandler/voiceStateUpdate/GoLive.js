const { VoiceState, Client } = require('discord.js');
const database = require('../../LoadDatabase');
const TWOHOURS = 1000 * 60 * 60 * 2; // 2 Horas.
const { sendStreaming, constructEmbed } = require('../Streamings');
module.exports = async (old = new VoiceState(), now = new VoiceState(), Muki = new Client()) => {
  try {
    if (now.streaming) {
      const { member } = now;
      console.log(`User ${now.member.user.tag} is streaming`);
      const activity = member.presence.activities[0];
      if (!activity) return console.log(`[GO LIVE] El user ${member.user.tag} comenzó a stremear con Go Live pero no se encontró una actividad.`);
      const activityName = activity.name;
      const timeNow = Date.now();


      if (database.GoLive.has(member.id)) {
        //If the member is already in the database means that we already have a sended message... probably.
        const dbmember = database.GoLive.get(member.id);
        console.log(`now: ${activityName} db: ${dbmember.activityName}`);
        const begun = dbmember.streamStarted;

        if ((timeNow - begun) >= TWOHOURS) {
          const { channel, id } = await sendStreaming(now);
          const timeNow = Date.now();
          database.GoLive.set(member.id, { sendedMessage: { channel: channel.id, messageID: id }, activityName: activityName, streamStarted: timeNow });
          return console.log(database.GoLive.get(member.id));
        } else {
          //If the elapsed time is not greater than two hours then we need to edit the message or return if the activity is the same as the previous.
          //console.log(database.GoLive.get(member.id));
          const dbmember = database.GoLive.get(member.id);
          if (activityName == dbmember.activityName) return console.log(`[GO LIVE] El usuario ${member.user.tag} ya estaba transmitiendo esta actividad`);
          const channel = Muki.channels.cache.get(dbmember.sendedMessage.channel);
          const message = await channel.messages.cache.fetch(dbmember.sendedMessage.messageID);
          const embed = await constructEmbed(now);
          if (!embed) return;

          database.GoLive.set(member.id, activityName, "activityName");
          console.log(database.GoLive.get(member.id));
          return await message.edit(embed);
        }
      } else {
        //If the member was not in the database we need to add him in.
        const message = await sendStreaming(now);
        if (!message) return;
        const streamer = {
          streamStarted: timeNow,
          tag: member.user.tag,
          activityName: activityName,
          sendedMessage: {
            channel: message.channel.id,
            messageID: message.id
          }
        };

        database.GoLive.set(member.id, streamer);
        return console.log(database.GoLive.get(member.id));
      }
    }
  } catch (error) {
    console.error(error);
  }
}