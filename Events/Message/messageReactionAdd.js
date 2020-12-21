const { MessageReaction, User } = require('discord.js');
const { basename } = require('path');

//#region Stars reaction
/**
 * @description Chequea cuando un usuario reacciona con ⭐ en un mensaje, si el mensaje llega a 5 ⭐ el mensaje será anclado en el canal.
 * @param {MessageReaction} reaction La reacción siendo añadida al mensaje.
 * @param {User} user El usuario que añade la reacción.
 */
const Stars = (reaction, user) => {

  const { message, users } = reaction;
  if (message.pinned || reaction.emoji.name !== '⭐') return;

  // Si la cantidad de reacciones ⭐ en el mensaje es mayor o igual que 5.
  if (users.cache.size >= 5) {
    message.pin({ reason: "El mensaje alcanzó 5 estrellas." }).catch(console.error);
  }
}


module.exports = {
  name: "messageReactionAdd",
  filename: basename(__filename),
  path: __filename,
  hasTimers: false,
  /**
  * @param {MessageReaction} reaction
  * @param {User} user
  */
  execute(reaction, user) {
    /*Code Here*/

    Stars(reaction, user);
    return;
  }
}