const { IncomingMessage, ServerResponse } = require('http')
/**
 * 
 * @param {IncomingMessage} request 
 * @param {ServerResponse} response 
 */
module.exports.Fuyumi = async (request, response) => {

  response.writeHead(200);

  response.write(JSON.stringify({
    avatarURL: client.user.displayAvatarURL({ size: 1024, format: "jpg" }),
    username: client.user.username,
    tag: client.user.tag,
    guildsCount: client.guilds.cache.size,
    usersOnCache: client.users.cache.size,
    uptime: client.uptime,
    ownerTag: "ShompiFlen#3338",
  }));

  response.end();
}