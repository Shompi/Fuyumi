/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
	FastifyRequest,
	FastifyReply
} from "fastify"
import type { Fuyumi } from "../../../types"

export const StatsRequestHandler = async (_r: FastifyRequest, reply: FastifyReply, client: Fuyumi.Client) => {
	await reply.code(200)
		.type('application/json')
		.send({
			message: "Request received!",
			data: {
				is_ready: client.isReady(),
				server_count: client.guilds.cache.size,
				server_icons: client.guilds.cache.filter(guild => !!guild.icon).map(guild => guild.iconURL({ size: 256 })),
				cached_users: client.users.cache.size,
				avatar: client.user?.displayAvatarURL({ size: 512 }),
				uptime: client.uptime,
				slash_commands: client.commands.map((command) => {
					return {
						name: command.data.name,
						description: command.data.description,
						type: command.data.toJSON().type,
						options: command.data.options?.map(option => ({ name: option.toJSON().name, description: option.toJSON().description, type: option.toJSON().type, required: option.toJSON().required }))
					}
				})
			}
		})
}