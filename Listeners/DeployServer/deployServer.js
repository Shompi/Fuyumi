const { Listener } = require('discord-akairo');
const http = require('node:http');
class DeployServer extends Listener {
  constructor() {
    super('deployServer', {
      emitter: 'client',
      event: 'deployServer'
    });
  }
  /**
   * 
   * @param {import("../../Classes/Client")} client 
   */
  async exec(client) {
    console.log("Starting Fuyumi stats Api...");

    const server = http.createServer();

    server.listen(2289);

    console.log("Stats api listening on port 2289");

    server.on('request', (request, response) => {

      console.log("Received a request on route:" + request.url);

      response.writeHead(200);
      response.writehead
      response.write(JSON.stringify({
        username: client.user.username,
        tag: client.user.tag,
        guildsCount: client.guilds.cache.size,
        usersOnCache: client.users.cache.size,
        uptime: client.uptime
      }));

      response.end();
    });
  }
}

module.exports = DeployServer;