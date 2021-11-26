const { ContextMenuInteraction, MessageEmbed } = require("discord.js");

/**
 * @returns {Promise<string>} avatar url
 * @param {ContextMenuInteraction} ctxInteraction
 */
module.exports.getUserAvatar = async (ctxInteraction) => {
  const { client, targetId } = ctxInteraction;

  const user = client.users.cache.get(targetId);

  const embed = new MessageEmbed()
    .setColor('BLUE')
    .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }));

  await ctxInteraction.reply({ embeds: [embed], ephemeral: true });
  return;
}