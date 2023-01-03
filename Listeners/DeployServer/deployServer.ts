import { Listener } from 'discord-akairo'
import { Client } from 'discord.js'
import { StatsRequestHandler } from "./Routes/stats"
import Fastify from "fastify"

let deployed = false
const SERVER = Fastify()
const PORT = 2289

module.exports = class DeployServer extends Listener {
  constructor() {
    super('deployServer', {
      emitter: 'client',
      event: 'deployServer',
    })
  }

  async exec(client: Client) {

    if (deployed) return console.log("Fastify api already deployed. Ignoring...")

    console.log("Starting fastify server on port" + PORT)

    // Route declaration
    console.log("Creating route /fuyumi/stats...")
    SERVER.get('/fuyumi/stats', async (req, reply) => StatsRequestHandler(req, reply, client))
    console.log("OK");

    // END Route declaration

    const SUCCESS = await SERVER.listen({ port: PORT }).catch(err => console.error(err))

    if (!SUCCESS) return console.log("Ocurrió un error al intentar iniciar el servidor.")
    deployed = true
    console.log("Server initiated!", SUCCESS);



  }
}