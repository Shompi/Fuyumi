const { Webhook, MessageEmbed, Message } = require('discord.js');
module.exports = async (message = new Message(), webHook = new Webhook()) => {
  /**
   * Incomplete.
   */
  try {
    const {author, member} = message;
    const embed = new MessageEmbed().setColor(member.displayColor);
    await webHook.send(null, {embeds:embed, username: author.username, avatarURL:author.displayAvatarURL({size:512})});
  } catch (error) {
    console.log("Hubo un error con Tablon Hook:");
    console.log(error);
  }
}