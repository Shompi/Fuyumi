import { ServerInfo } from '../functions/info-server.js';
import { UserInfo } from '../functions/info-user.js';
import { RoleInfo } from '../functions/info-role.js';
import { Subcommand } from '@sapphire/plugin-subcommands';


// Extend `Subcommand` instead of `Command`
export class GeneralInfo extends Subcommand {
	public constructor(context: Subcommand.Context, options: Subcommand.Options) {
		super(context, {
			...options,
			name: 'info',
			subcommands: [
				{
					name: 'user',
					chatInputRun: 'chatInputUser'
				},
				{
					name: 'server',
					chatInputRun: 'chatInputServer'
				},
				{
					name: 'role',
					chatInputRun: 'chatInputRole'
				}
			]
		});
	}

	registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName('info')
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
				})
		);
	}

	public async chatInputServer(interaction: Subcommand.ChatInputCommandInteraction) {
		await ServerInfo(interaction)
	}

	public async chatInputUser(interaction: Subcommand.ChatInputCommandInteraction) {
		await UserInfo(interaction)
	}

	public async chatInputRole(interaction: Subcommand.ChatInputCommandInteraction) {
		await RoleInfo(interaction)
	}
}
