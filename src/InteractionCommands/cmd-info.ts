import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ServerInfo } from './SubCommands/info-server';
import { UserInfo } from './SubCommands/info-user';
import { RoleInfo } from './SubCommands/info-role';

export = {
	hasSubcommands: true,
	subcommands: ["info-server.js", "info-user.js", "info-role.js"],
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Comandos de información general')
		.addSubcommand(guildInfo => {
			return guildInfo.setName('server')
				.setDescription('Información del servidor')
		})
		.addSubcommand(subcommand => {
			return subcommand.setName('user')
				.setDescription('Info de un usuario dentro de este servidor')
				.addUserOption(user => {
					return user.setName('usuario')
						.setDescription('El usuario del que quieres ver la info, default: Tú')
						.setRequired(false)
				})
				.addStringOption(id => {
					return id.setName('id')
						.setDescription('La id del usuario de Discord')
						.setRequired(false)
				})
		})
		.addSubcommand(roleInfo => {
			return roleInfo.setName('role')
				.setDescription('Información acerca de un rol de este servidor')
				.addRoleOption(role => {
					return role.setName('rol')
						.setDescription('El rol que quieres ver')
						.setRequired(true)
				})
		}),
	isGlobal: true,
	async execute(interaction: ChatInputCommandInteraction) {
		const commandName = interaction.options.getSubcommand();

		switch (commandName) {
			case 'server':
				await ServerInfo(interaction);
				break;
			case 'user':
				await UserInfo(interaction);
				break;
			case 'role':
				await RoleInfo(interaction);
				break;
		}
	}
}