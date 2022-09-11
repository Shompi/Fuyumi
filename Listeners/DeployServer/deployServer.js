const { Listener } = require('discord-akairo');
const http = require('node:http');
const { Fuyumi } = require('./Routes/Api/fuyumi');
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

    server.listen(80);

    console.log("Stats api listening on port 80");

    server.on('request', async (request, response) => {
      console.log("Received a request on route:" + request.url);

      if (request.url === '/') {
        return response.writeHead(200).end('Holiiii')

      } else if (request.url === '/api/fuyumi') {
        return await Fuyumi(request, response, client);

      } else {
        return response.writeHead(404).end('Holi');
      }

    });
  }
}

module.exports = DeployServer;