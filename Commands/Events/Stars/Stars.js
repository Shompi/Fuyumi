const { MessageReaction } = require('discord.js');


module.exports = async (reaction = new MessageReaction(), user) => {
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