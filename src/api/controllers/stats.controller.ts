import type { Request, Response } from "express";
import { client as botClient } from "../../index.js"

interface GeneralStatsResponse {
	guilds: {
		name: string,
		iconURL: string,
		member_count: number
	}[]

	user_count: number,
	username: string,
	avatar: string
	commands?: {
		name: string,
		description: string
	}[]
	uptime: number
}


export const getStats = (req: Request, res: Response) => {

	if (botClient.isReady()) {

		return res.status(200).json({
			guilds: botClient.guilds.cache.map(guild => ({ name: guild.name, member_count: guild.memberCount, iconURL: guild.iconURL() ?? "No icon." })),
			avatar: botClient.user.displayAvatarURL(),
			uptime: botClient.uptime,
			user_count: botClient.guilds.cache.reduce((ac, guild) => ac + guild.memberCount, 0),
			username: botClient.user.username,
			commands: botClient.application.commands.cache.map(command => ({ name: command.name, description: command.description }))
		} satisfies GeneralStatsResponse)
	} else {
		return res.status(400).json({
			message: "Cannot retrieve information about Fuyumi at this time because the client is not ready."
		})
	}
}