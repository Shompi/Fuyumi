import { Listener } from 'discord-akairo';
import { EmbedBuilder, Colors, type GuildMember } from 'discord.js';

export default class GuildMemberAddListener extends Listener {
	constructor() {
		super('guildMemberAdd', {
			emitter: 'client',
			event: 'guildMemberAdd'
		});
	}

	async exec(member: GuildMember) {

		if (member.guild.id !== '537484725896478733')
			return;

		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		const content = `¡Bienvenido ${member}! Puedes asignarte roles en <#865360481940930560>`;
		const embed = new EmbedBuilder()
			.setTitle(`¡Bienvenido a ${member.guild.name} ${member.displayName}!`)
			.setDescription(`Eres el miembro N°**${member.guild.memberCount}**`)
			.setColor(Colors.Blue)
			.setTimestamp();

		return await member.guild.systemChannel?.send({ content, embeds: [embed] }).catch(console.error);
	}
}