module.exports.sendInfoToAPI = async (client) => {

	const guilds = client.guilds.cache.map(guild => {

		return ({
			name: guild.name,
			icon: guild.iconURL({ size: 256 }),
			members: guild.memberCount,
			channels: guild.channels.cache.size,
			owner: {
				tag: guild.owner?.user.tag,
				avatar_url: guild.owner?.user.displayAvatarURL({ size: 256 }),
			}
		})
	});

	const payload = {
		client: {
			tag: client.user.tag,
			avatar_url: client.user.displayAvatarURL({ size: 512 }),
			cached_users: client.users.cache.size,
			cached_channels: client.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0),
		},
		guilds: guilds
	}

	await fetch("http://localhost:4000/muki/update", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: JSON.stringify(payload),
		timeout: 2000
	}).catch(e => null);
}

module.exports.sendMemeToAPI = async (client) => {

	/**@type {TextChannel} */
	const memesChannel = client.channels.cache.get("622889689472303120");

	if (fetchMemes)
		await memesChannel.messages.fetch({ limit: 50 }, true, true);


	const lastMemes = memesChannel.messages.cache.filter(message => message.attachments.size >= 1);

	if (lastMemes.size === 0)
		return; // No hay memes :(

	const memes = lastMemes.map(message => {
		return {
			author: {
				tag: message.author.tag,
				avatar_url: message.author.displayAvatarURL({ size: 512 })
			},
			image_url: message.attachments.first().url
		}
	});

	await fetch("http://localhost:4000/exiliados/memes", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: JSON.stringify(memes),
		timeout: 2000
	}).catch(e => null);
}