const { VoiceState, Client } = require('discord.js');
const database = require('../../LoadDatabase');
const TWOHOURS = 1000 * 60 * 60 * 2; // 2 Horas.
const {sendStreaming, constructEmbed} = require('../Streamings');
module.exports = async (old = new VoiceState(), now = new VoiceState(), Muki = new Client()) => {
  try {
    if (now.streaming) {
      console.log(`User ${now.member.user.tag} is streaming`);
      const member = now.member;
      const timeNow = Date.now();
      if (database.streamings.has(member.id)) {
        //If the member is already in the database means that we already have a sended message... probably.
        const activityName = member.presence.activities[0].name;
        const dbmember = database.streamings.get(member.id);
        console.log(`now: ${activityName} db: ${dbmember.activityName}`);
        if (activityName == dbmember.activityName) return console.log(`El usuario ${member.user.tag} ya estaba transmitiendo esta actividad`);

        const begun = database.streamings.get(member.id, 'streamStarted');
        if ((timeNow - begun) >= TWOHOURS) {
          const { channel, id } = await sendStreaming(now);
          const timeNow = Date.now();
          database.streamings.set(member.id, { sendedMessage: { channel: channel.id, messageID: id }, activityName: activityName, streamStarted: timeNow });
          return console.log(database.streamings.get(member.id));
        } else {
          //If the elapsed time is not greater than two hours then we need to edit the message.
          //console.log(database.streamings.get(member.id));
          const dbmember = database.streamings.get(member.id);
          const channel = Muki.channels.get(dbmember.sendedMessage.channel);
          const message = await channel.messages.fetch(dbmember.sendedMessage.messageID);
          const embed = await constructEmbed(now);
          if (!embed) return;

          database.streamings.set(member.id, activityName, "activityName");
          console.log(database.streamings.get(member.id));
          return await message.edit(embed);
        }
      } else {
        //If the member was not in the database we need to add him in.
        const message = await sendStreaming(now);
        if (!message) return;
        const streamer = {
          streamStarted: timeNow,
          tag: member.user.tag,
          activityName: now.member.presence.activities[0].name,
          sendedMessage: {
            channel: message.channel.id,
            messageID: message.id
          }
        };

        database.streamings.set(member.id, streamer);
        return console.log(database.streamings.get(member.id));
      }
    }
  } catch (error) {
    console.error(error);
  }
}