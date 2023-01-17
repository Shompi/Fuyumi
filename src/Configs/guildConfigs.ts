import type { Guild } from "discord.js";

export function CreateGuildConfig(guild: Guild) {
	return ({
		id: guild.id,
		welcome: {
			enabled: false,
			join: [],
			leave: [],
			channelID: null,
		}
	});
}