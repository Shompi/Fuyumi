import { EmbedBuilder, Events, GuildMember, type TextBasedChannel } from "discord.js"
import { Listener } from "@sapphire/framework";

export class GuildMemberRemoveListener extends Listener {

	public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options,
			once: false,
			name: Events.GuildMemberRemove
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

		const channel = client.channels.cache.get("806268687333457920") as TextBasedChannel

		if (channel.isSendable()) {
			channel.send({
				embeds: [embed]
			})
		}
	}
}
