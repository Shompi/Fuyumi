const { MessageEmbed, GuildMember, User } = require('discord.js');
const database = require('../../loadEnmaps').guildConfigs;
const { basename } = require('path');


/**@param {User} user */
const salida = (user, config) => {
	const { client: Muki } = user;
	const crab = Muki.emojis.cache.find(emoji => emoji.name == 'crabb');

	const frases = config.welcome.leavePhrases;

	let frase = "";

	if (frases.length > 0) frase = frases[Math.floor(Math.random() * frases.length)];

	return new MessageEmbed()
		.setTitle(`⬅ ¡${user.tag} ha abandonado el servidor!`)
		.setDescription(`${frase} ${crab}`)
		.setColor("RED")
		.setThumbnail(user.displayAvatarURL({ size: 512 }))
}

module.exports = {
	name: "guildMemberRemove",
	filename: basename(__filename),
	path: __filename,
	hasTimers: false,
	/**
	*@param {GuildMember} member
	*/
	execute(member) {
		/*Code Here*/
		const { client: Muki, guild, user } = member;

		const config = database.get(guild.id);
		if (!config) return console.log(`Por alguna razón la guild ${guild.name} no tenia entrada de configuración. (EHandler/Guild/memberAdd)`);

		if (config.welcome.enabled) {

			//channelID should be either a valid id string or null.
			const channel = Muki.channels.cache.get(config.welcome.channelID);

			//If channel comes undefined
			if (!channel) {
				const systemchannel = guild.systemChannel;
				if (!systemchannel) return;
				else systemchannel.send(salida(user, config)).catch(err => console.log(`La guild ${guild.name} no tiene canal de bienvenida, ni canal de sistema.`));

			} else return channel.send(salida(user, config));

		}
		else return undefined;

	}
}