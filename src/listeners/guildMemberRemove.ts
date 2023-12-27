import { EmbedBuilder, GuildMember, TextBasedChannel } from "discord.js"
import { Listener } from "@sapphire/framework";

export class GuildMemberRemoveListener extends Listener {

	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: false,
		});
	}

	public async run(member: GuildMember) {
		const client = member.client

		if (member.guild.id !== client.exiliados)
			return;

		const { id } = member;
		const userInformation = await client.users.fetch(id);

		const embed = new EmbedBuilder()
			.setDescription(`El usuario ${userInformation.username} (${id})\nHa abandonado el servidor.`)
			.setColor("Random")
			.setThumbnail(userInformation.displayAvatarURL({ size: 256 }))
			.setTimestamp()

		await (client.channels.cache.get("806268687333457920") as TextBasedChannel).send({
			embeds: [embed]
		})
	}
}
