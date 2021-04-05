const { Presence, MessageEmbed } = require('discord.js');
const TWOHOURS = 1000 * 60 * 60 * 2; // 2 Horas.
const enmap = require('enmap');
const database = new enmap({ name: 'streamings' });

const config = {
	enabled: false,
	channel: "",
}

/**
 * @param {Presence} old 
 * @param {Presence} now 
 */
module.exports = async (old, now) => {

	console.log("GOLIVE TRIGGERED");
	console.log("SIZE OF THE DB: ", database.size);
	console.log("INFO ON DB:", database.random());

	const { client, guild } = now;

	if (!database.has(guild.id)) {
		database.set(guild.id, config);
	}

	const guildConfig = database.get(guild.id);
	if (!guildConfig.enabled) return;

	try {
		if (now.member.partial)
			await member.fetch();


		if (now.streaming) {
			let newuser = false;

			console.log("GO LIVE");
			if (!client.db.GoLive.has(now.member.id)) {
				client.db.GoLive.set(now.member.id, Date.now());
				newuser = true;
			}

			const timediff = Date.now() - client.db.GoLive.get(now.member.id);
			console.log(`Timediff: ${timediff}`);
			if (timediff < TWOHOURS && !newuser) return;

			const livestreamChannel = guild.channels.cache.get(guildConfig.channel);

			if (!livestreamChannel) return;

			const game = now.member.presence.activities.find(activity => activity.type === "PLAYING") || now.member.presence.activities.find(activity => activity.type !== "CUSTOM_STATUS") || { name: "Actividad Desconocida" };

			if (!game) return;

			const gameImage = client.db.gameImages.get(game.name);

			const embed = new MessageEmbed()
				.setThumbnail(now.member.user.displayAvatarURL({ size: 512, dynamic: true }))
				.setTitle(`¡${now.member.displayName} ha comenzado a transmitir ${game.name} en el canal ${now.channel.name}!`)
				.setImage(gameImage);


			client.db.GoLive.set(now.member.id, Date.now());
			livestreamChannel.send(embed);
		}

	} catch (error) {
		console.error(error);
	}
}