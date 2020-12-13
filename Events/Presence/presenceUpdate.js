const { Presence } = require('discord.js');
const { basename } = require('path');
const twitch = require('./Twitch/main.js');

module.exports = {
  name: "presenceUpdate",
  filename: basename(__filename),
  path: __filename,
  hasTimers: false,
  /**
  *@param {Presence} old
  *@param {Presence} now
  */
  execute(old, now) {
    /*Code Here*/
    twitch(old, now);
  }
}