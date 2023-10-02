import { ChannelType, PermissionFlagsBits } from 'discord.js'

/* Comandos */
import { TimeoutMember } from '../functions/mod-timeout.js';
import { Poll } from '../functions/mod-poll.js';
import { Announce } from '../functions/mod-announce.js';
import { ChangeVoiceRegion } from '../functions/mod-voiceRegion.js';
import { Subcommand } from '@sapphire/plugin-subcommands';

// Extend `Subcommand` instead of `Command`
export class ModerationCommands extends Subcommand {
	public constructor(context: Subcommand.Context, options: Subcommand.Options) {
		super(context, {
			...options,
			name: 'moderacion',
			subcommands: [
				{
					name: 'timeout',
					chatInputRun: 'chatInputTimeout'
				},
				{
					name: 'anuncio',
					chatInputRun: 'chatInputAnnounce'
				},
				{
					name: 'encuesta',
					chatInputRun: 'chatInputPoll'
				},

				{
					name: 'region-de-voz',
					chatInputRun: 'chatInputRegion'
				},
			]
		});
	}

	registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('moderacion')
				.setDescription('Comandos de moderación')
				.setDMPermission(false)
				.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers | PermissionFlagsBits.KickMembers)

				// GuildMember timeout command
				.addSubcommand(timeout => {
					return timeout.setName('timeout')
						.setDescription('Silencia al usuario no permitiendole interactuar ni conectar a canales de voz.')
						.addUserOption(inputUser => {
							return inputUser.setName('miembro')
								.setDescription('El miembro al que quieres silenciar.')
								.setRequired(true)
						})
						.addIntegerOption(segundos => {
							return segundos.setName('segundos')
								.setDescription('Tiempo en segundos por el cual quieres silenciar a este miembro.')
								.setMinValue(5)
								.setRequired(false)
						})
						.addStringOption(reason => {
							return reason.setName('razon')
								.setDescription('La razón por la que silenciarás a este miembro.')
								.setRequired(false)
						})
				})

				// Announcement command
				.addSubcommand(announce => {
					return announce.setName('anuncio')
						.setDescription('Crea y envia un mensaje dentro de un embed a un canal de texto.')
						.addChannelOption(channel => {
							return channel.setName('canal')
								.setDescription('Canal al que quieres enviar este anuncio')
								.setRequired(true)
								.addChannelTypes(ChannelType.GuildText, ChannelType.GuildNews);
						})
						.addStringOption(description => {
							return description.setName('descripcion')
								.setDescription('Una detallada descripción de tu anuncio, hasta 1500 caracteres.')
								.setRequired(true)
						})
						.addStringOption(titulo => {
							return titulo.setName('titulo')
								.setDescription('El titulo de este anuncio')
								.setRequired(false)
						})
						.addStringOption(color => {
							return color.setName('color')
								.setDescription('El color que quieres que tenga el embed (barra lateral izquierda)')
								.addChoices(
									{ name: "Amarillo", value: "Yellow" },
									{ name: "Azul", value: "Blue" },
									{ name: "Blanco", value: "White" },
									{ name: "Dorado", value: "Gold" },
									{ name: "Fucsia", value: "Fuchsia" },
									{ name: "Morado", value: "Purple" },
									{ name: "Naranja", value: "Orange" },
									{ name: "Rojo", value: "Red" },
									{ name: "Verde", value: "Green" },
									{ name: "Verde Oscuro", value: "DarkGreen" },
									{ name: "Random", value: "Random" },
								)
						})
						.addStringOption(imagen => {
							return imagen.setName('imagen')
								.setDescription('Si quieres adjuntar una imagen en el embedido, escribe la URL aqui')
								.setRequired(false)
						})
						.addStringOption(thumbnail => {
							return thumbnail.setName('miniatura')
								.setDescription('URL de la imagen miniatura del embed')
								.setRequired(false)
						})
						.addStringOption(footer => {
							return footer.setName('pie')
								.setDescription('El pié de página de este anuncio')
								.setRequired(false)
						})
						.addMentionableOption(mencion => {
							return mencion.setName('mencion1')
								.setDescription('Rol o Usuario que quieres mencionar')
								.setRequired(false)
						})
						.addMentionableOption(mencion => {
							return mencion.setName('mencion2')
								.setDescription('Rol o Usuario que quieres mencionar')
								.setRequired(false)
						})
						.addMentionableOption(mencion => {
							return mencion.setName('mencion3')
								.setDescription('Rol o Usuario que quieres mencionar')
								.setRequired(false)
						})
				})

				// Poll Command
				.addSubcommand(input => input.setName('encuesta')
					.setDescription('Comando para realizar encuestas en un canal.')
					.addStringOption(title => title.setName('titulo').setDescription('El título de ésta encuesta'))
					.addStringOption(description => description.setName('descripcion').setDescription('La descripción de esta encuesta'))
					.addChannelOption(channel => channel.setName('canal').setDescription('El canal en donde quieres enviar la encuesta. (def: El canal donde usas el comando)')
						.addChannelTypes(ChannelType.GuildText))
					.addStringOption(option1 => option1.setName('opcion_1').setDescription("Opcion de la encuesta"))
					.addStringOption(option2 => option2.setName('opcion_2').setDescription("Opcion de la encuesta"))
					.addStringOption(option3 => option3.setName('opcion_3').setDescription("Opcion de la encuesta"))
					.addStringOption(option4 => option4.setName('opcion_4').setDescription("Opcion de la encuesta"))
					.addStringOption(option5 => option5.setName('opcion_5').setDescription("Opcion de la encuesta"))
					.addIntegerOption(tiempo => tiempo.setName('duracion').setDescription('La duración de esta encuesta en minutos. (def: 5 minutos)')))

				// Voice Region command
				.addSubcommand(command => command.setName("region-de-voz").setDescription("Cambia la región de voz del canal en el que estás")
					.addStringOption(region => region.setName('region').setDescription("La región a la que quieres cambiar el canal")
						.setRequired(false)
						.addChoices(
							{ name: "Brazil", value: "brazil" },
							{ name: "Japón", value: "japan" },
							{ name: "Estados Unidos Central", value: "us-central" },
							{ name: "Estados Unidos Este", value: "us-east" },
							{ name: "Estados Unidos Oeste", value: "us-west" },
							{ name: "Automático", value: "auto" }
						)
					)
				)
		);
	}

	public async chatInputTimeout(interaction: Subcommand.ChatInputCommandInteraction<'cached'>) {
		return await TimeoutMember(interaction);
	}

	public async chatInputAnnounce(interaction: Subcommand.ChatInputCommandInteraction) {
		return await Announce(interaction);

	}

	public async chatInputPoll(interaction: Subcommand.ChatInputCommandInteraction<'cached'>) {
		return await Poll(interaction);

	}

	public async chatInputRegion(interaction: Subcommand.ChatInputCommandInteraction<'cached'>) {
		return await ChangeVoiceRegion(interaction);
	}
}