const { ContextMenuInteraction } = require("discord.js");
const {
  getUserAvatar,
} = require('./modules/exports');

/**
 * @param {ContextMenuInteraction} ctxInteraction
 */
module.exports.ContextMenuHandler = async (ctxInteraction) => {
  const { commandName, targetId, client, targetType } = ctxInteraction;

  switch (commandName) {
    case 'Avatar':
      if (targetType !== "USER") return ctxInteraction.reply({ content: "Esto solo puede usarse sobre usuarios.", ephemeral: true });
      getUserAvatar(ctxInteraction);
      break;
  }
}