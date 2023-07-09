/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { ButtonInteraction } from "discord.js";


const NSFWROLES = ["745385918546051222", "866061257923493918"];

const Mayor18Id = '544718986806296594';

export async function ButtonAddRoles(interaction: ButtonInteraction) {
	// Enviemos un mensaje por ahora
	if (interaction.inCachedGuild()) {
		const { guild, member } = interaction;

		// customId llega como role-123456789l0
		const RoleId = interaction.customId.slice(5);
		const RoleObject = guild.roles.cache.get(RoleId);
		const MemberIsOver18 = member.roles.cache.has(Mayor18Id);

		let operation;

		console.log(`${interaction.member.user.username} presionó ${interaction.component.label}`);

		if (!RoleObject) return;

		if (NSFWROLES.includes(RoleId) && !MemberIsOver18)
			return await interaction.reply({
				content: 'Debes tener el rol **Mayor de 18** para poder asignarte este rol.',
				ephemeral: true,
			});


		if (MemberIsOver18 && RoleId === Mayor18Id) {
			await member.roles.remove([...NSFWROLES, Mayor18Id]);

			return await interaction.reply({
				content: '**Se te han quitado todos los roles NSFW / +18**',
				ephemeral: true,
			});
		}


		if (member.roles.cache.has(RoleId)) {
			operation = await member.roles.remove(RoleId).then(() => false);
		}
		else {
			operation = await member.roles.add(RoleId).then(() => true);
		}

		return await interaction.reply({
			content: `Se te **${operation ? 'agregó' : 'quitó'}** el rol **${RoleObject.name}**`,
			ephemeral: true,
		});
	}
}