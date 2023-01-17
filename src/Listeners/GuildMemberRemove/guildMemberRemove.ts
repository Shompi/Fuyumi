import { Listener } from "discord-akairo"
import { EmbedBuilder, GuildMember } from "discord.js"
import { Fuyumi } from "../../types";

export default class GuildMemberRemoveListener extends Listener {
	constructor() {
		super('guildMemberRemove', {
			emitter: 'client',
			event: 'guildMemberRemove'
		})
	}

	async exec(member: GuildMember) {
		const { id } = member;
		const client = member.client as Fuyumi.Client

		const userInformation = await client.users.fetch(id);

		const embed = new EmbedBuilder()
			.setDescription(`El usuario ${userInformation.tag} (${id})\nHa abandonado el servidor.`)
			.setColor("Random")
			.setThumbnail(userInformation.displayAvatarURL({ size: 256 }))
			.setTimestamp()

		await client.privateChannel.send({
			embeds: [embed]
		})
	}
}
