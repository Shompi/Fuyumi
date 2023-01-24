import { Listener } from "discord-akairo"
import { EmbedBuilder, GuildMember } from "discord.js"
import { Fuyumi } from "@myTypes/index";

export default class GuildMemberRemoveListener extends Listener {
	constructor() {
		super('guildMemberRemove', {
			emitter: 'client',
			event: 'guildMemberRemove'
		})
	}

	async exec(member: GuildMember) {
		const client = member.client as Fuyumi.Client

		if (member.guild.id !== client.exiliados.id)
			return;

		const { id } = member;
		const userInformation = await client.users.fetch(id);

		const embed = new EmbedBuilder()
			.setDescription(`El usuario ${userInformation.tag} (${id})\nHa abandonado el servidor.`)
			.setColor("Random")
			.setThumbnail(userInformation.displayAvatarURL({ size: 256 }))
			.setTimestamp()

		await client.testChannel.send({
			embeds: [embed]
		})
	}
}
