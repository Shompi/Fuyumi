import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Colors, GuildTextBasedChannel, Client } from 'discord.js';

/**
 * 
 * @param {Object} param0
 * @param {string} param0.roleId La id del rol al que este botón pertenece
 * @param {ButtonStyle} param0.style El estilo de este botón
 * @param {string} param0.label La etiqueta de este botón
 */

interface CreateButtonArguments {
	roleId: string
	style: ButtonStyle,
	label: string
}
function createButton({ roleId, style, label }: CreateButtonArguments) {
	return new ButtonBuilder()
		.setCustomId(`role-${roleId}`)
		.setStyle(style)
		.setLabel(label);
}

export async function UpdateButtons(client: Client) {

	const RolesChannel = client.channels.cache.get("865360481940930560") as GuildTextBasedChannel

	// Roles de Juegos

	/* SUCCESS ROW */

	const ApexLegendsButton = createButton({ style: ButtonStyle.Success, roleId: "865729353215246357", label: "Apex Legends" });

	const CSGOButton = createButton({ style: ButtonStyle.Success, roleId: "699832400510976061", label: "Counter-Strike: GO" });

	const DayZButton = createButton({ style: ButtonStyle.Success, roleId: "879217872147185714", label: "Day Z" });

	const EscapeFromTarkovButton = createButton({ style: ButtonStyle.Success, roleId: "676967872807043072", label: "Escape from Tarkov" });

	const FIFAButton = createButton({ style: ButtonStyle.Success, roleId: "945050513236434945", label: "FIFA" });

	/* PRIMARY ROW */

	const FortniteButton = createButton({ style: ButtonStyle.Primary, roleId: "627237678248886292", label: "Fortnite" });

	const GenshinImpactButton = createButton({ style: ButtonStyle.Primary, roleId: "810412477116448769", label: "Genshin Impact" });

	const GTAVButton = createButton({ style: ButtonStyle.Primary, roleId: "867227218422005781", label: "GTA V" });

	const LeagueButton = createButton({ style: ButtonStyle.Primary, roleId: "865393189628149760", label: "League of Legends" });

	const MinecraftButton = createButton({ style: ButtonStyle.Primary, roleId: "865394122897227797", label: "Minecraft" });

	/* SUCCESS ROW */

	const Phasmophobia = createButton({ style: ButtonStyle.Success, roleId: "973109918817214524", label: "Phasmophobia" });

	const RocketLeagueButton = createButton({ style: ButtonStyle.Success, roleId: "585905903912615949", label: "Rocket League" });

	const TetrisEffect = createButton({ style: ButtonStyle.Success, roleId: "1148446792464220281", label: "Tetris Effect: Connected" });

	const Tetrio = createButton({ style: ButtonStyle.Success, roleId: "1148446907870490624", label: "TETR.IO" });

	const SeaOfThievesButton = createButton({ style: ButtonStyle.Success, roleId: "854968345974669313", label: "Sea of Thieves" });

	/* PRIMARY ROW */


	const ValorantButton = createButton({ style: ButtonStyle.Primary, roleId: "707341893544968324", label: "Valorant" });

	const WarzoneButton = createButton({ style: ButtonStyle.Primary, roleId: "700166161295474728", label: "COD: Warzone" });

	const WarThunderButton = createButton({ style: ButtonStyle.Primary, roleId: "865423770264928296", label: "War Thunder" });

	const row1 = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			ApexLegendsButton,
			CSGOButton,
			DayZButton,
			EscapeFromTarkovButton,
			FIFAButton,
		]);

	const row2 = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			FortniteButton,
			GenshinImpactButton,
			GTAVButton,
			LeagueButton,
			MinecraftButton,
		]);

	const row3 = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			RocketLeagueButton,
			Phasmophobia,
			Tetrio,
			TetrisEffect,
			SeaOfThievesButton,
		]);

	const row4 = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			ValorantButton,
			WarzoneButton,
			WarThunderButton,
		]);

	const JuegosEmbed = new EmbedBuilder()
		.setColor(Colors.Blue)
		.setTitle('Roles de Juegos')
		.setDescription('¿Quieres el rol de un juego que no está en la lista? ¡Puedes pedirlo en el canal general!');

	await RolesChannel.messages.fetch('865370324044742656')
		.then(async (message) => {
			await message.edit({
				components: [row1, row2, row3, row4],
				embeds: [JuegosEmbed],
			});
		});



	// Roles NSFW
	const AdultButton = createButton({ style: ButtonStyle.Danger, roleId: "544718986806296594", label: "Mayor de 18" });

	const ApostadorButton = createButton({ style: ButtonStyle.Danger, roleId: "745385918546051222", label: "Apostador Compulsivo" });

	const DegeneradoButton = createButton({ style: ButtonStyle.Danger, roleId: "866061257923493918", label: "Degenerado" });

	const AdultRow1 = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			AdultButton,
			ApostadorButton,
			DegeneradoButton,
		]);

	const NSFWRolesEmbed = new EmbedBuilder()
		.setTitle('Roles +18')
		.setDescription('Si te quitas el rol **Mayor de 18** automáticamente se te quitarán todos los demás roles de esta categoria.')
		.setColor(Colors.Red);

	await RolesChannel.messages.fetch("866060332594233365").then(async (message) => {
		await message.edit({
			embeds: [NSFWRolesEmbed],
			components: [AdultRow1],
		});
	});

	// Roles Misceláneos

	const EstudianteButton = createButton({ style: ButtonStyle.Primary, roleId: "576195996728426526", label: "Estudiante" });

	const JovenProgramadorButton = createButton({ style: ButtonStyle.Primary, roleId: "690009340681388115", label: "Programador" });

	const SimpButton = createButton({ style: ButtonStyle.Primary, roleId: "752006971527266374", label: "SIMP" });

	const WeebButton = createButton({ style: ButtonStyle.Primary, roleId: "644251281204183070", label: "Weeb / Otaku" });

	const Techquickie = createButton({ style: ButtonStyle.Primary, roleId: "625783665082892288", label: "Techquickie" });

	const MiscEmbed = new EmbedBuilder()
		.setTitle('Roles Misceláneos')
		.setDescription('No todos los roles te darán acceso a un canal nuevo, algunos son solamente para el look.')
		.setColor(Colors.Yellow);

	const MiscRow1 = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			EstudianteButton,
			JovenProgramadorButton,
			SimpButton,
			Techquickie,
			WeebButton,
		]);

	await RolesChannel.messages.fetch('866071653128732682').then(async (message) => {
		await message.edit({
			embeds: [MiscEmbed],
			components: [MiscRow1],
		});
	});

	// Streamer panel
	const StreamerEmbed = new EmbedBuilder()
		.setTitle('Streamer Role')
		.setColor(Colors.Purple)
		.setDescription('¿Eres Streamer?, ¿Quieres que tus transmisiones aparezcan en el canal <#600159867239661578>?\nEntonces asignate este rol!');


	const StreamerButton = createButton({ style: ButtonStyle.Primary, roleId: "912096189443350548", label: "Streamer" });

	const StreamerRow1 = new ActionRowBuilder<ButtonBuilder>()
		.addComponents([
			StreamerButton
		]);

	await RolesChannel.messages.fetch("912096885882363994").then(async (message) => {
		await message.edit({
			embeds: [StreamerEmbed],
			components: [StreamerRow1]
		})
	});

	console.log("Los botones han sido cargados / actualizados!");
	return true;
}