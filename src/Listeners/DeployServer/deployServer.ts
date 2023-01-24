import { Listener } from 'discord-akairo'
import { StatsRequestHandler } from "./Routes/stats"
import Fastify from "fastify"
import { Fuyumi } from '@myTypes/index'

let deployed = false
const SERVER = Fastify()
const PORT = 2289

export default class DeployServer extends Listener {
	constructor() {
		super('deployServer', {
			emitter: 'client',
			event: 'deployServer',
		})
	}

	async exec(client: Fuyumi.Client) {

		if (deployed) return console.log("Fastify api already deployed. Ignoring...")

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