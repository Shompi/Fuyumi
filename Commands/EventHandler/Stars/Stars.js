const { MessageReaction, User } = require('discord.js');


module.exports = async (reaction = new MessageReaction(), user = new User()) => {
  const { message, users } = reaction;

  if (reaction.emoji.name !== '⭐') return;
  if (message.pinned) return;

  if (users.cache.size >= 5) {
    if (message.pinnable) return await message.pin();
  }

  return;
} 