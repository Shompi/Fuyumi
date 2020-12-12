const { MessageReaction, User } = require('discord.js');
const { basename } = require('path');

module.exports = {
  name: "messageReactionAdd",
  filename: basename(__filename),
  path: __filename,
  hasTimers: false,
  /**
  * @param {MessageReaction} reaction
  * @param {User} user
  */
  async execute(reaction, user) {
    /*Code Here*/
    const { message, users } = reaction;

    if (reaction.emoji.name !== '⭐') return;
    if (message.pinned) return;

    if (users.cache.size >= 5) {
      try {
        if (message.pinnable)
          await message.pin();
      }
      catch (e) {
        console.log(e);
      }
    }

    return;
  }
}