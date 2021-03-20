const { VoiceState, MessageEmbed } = require('discord.js');
const { basename } = require('path');
const GoLive = require('./GoLive/main');

module.exports = {
  name: "voiceStateUpdate",
  filename: basename(__filename),
  path: __filename,
  hasTimers: false,
  /**
  *@param {VoiceState} old
  *@param {VoiceState} now
  */
  execute(old, now) {
    /*Code Here*/
    GoLive(old, now);
  }
}