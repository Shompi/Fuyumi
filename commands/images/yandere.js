const { Command } = require('discord-akairo');
const { MessageEmbed, Message } = require('discord.js');

const fetch = require('node-fetch').default;
const { YanderePost } = require('../../Classes/Booru');

class YandereCommand extends Command {
	constructor() {
		super('dere', {
			aliases: ['dere', 'yandere'],
			description: 'Busca imágenes en yande.re',
			clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES"],
			args: [{
				id: 'content',
				type: 'string',
				match: 'content',
			}]
		});
	}

	/**
	 * @param {Message} message
	 * @param {string} content
	 */

	async exec(message, { content }) {
		const { channel, author } = message;
		try {

			if (content.split(/\s*\+\s*/g).length >= 3) return message.reply('lo siento, solo puedes usar un máximo de 3 tags para la búsqueda.');

			let query = content.replace(/\s*\+\s*/g, "+").replace(/\s+/g, "_");
			console.log("QUERY: ", query);
			let blacklist = '+-loli'; //Tags blacklist

			let data = await fetch(`https://yande.re/post.json?limit=100&tags=${query}${blacklist}`).catch(e => {
				throw 'Fetch Error: ' + e.code;
			});

			/**@type {YanderePost[]|null} */
			let response = await data.json().catch(() => null);

			// No hay resultados.
			if (response.length === 0)
				return channel.send(noResults);

			if (message.channel.type !== 'dm' && !message.channel.nsfw) {
				respose = response.filter(post => post.rating === 's');
			}

			let pageindex = Math.floor(Math.random() * response.length);
			const embed = showpage(response[pageindex], message, pageindex, response.length);
			const msg = await channel.send(embed);

			await msg.react('⬅');
			await msg.react('➡');
			await msg.react('🔄');

			const filter = (reaction, user) => ((reaction.emoji.name === '⬅' || reaction.emoji.name === '➡' || reaction.emoji.name === '🔄') && user.id === author.id);

			msg.createReactionCollector(filter, { time: 1000 * 60 * 4 })
				.on('collect', (reaction) => {
					if (reaction.emoji.name == '➡') {
						pageindex++;
						if (pageindex >= response.length) pageindex = 0;
						const page = showpage(response[pageindex], message, pageindex, response.length);
						msg.edit(page);
					}

					if (reaction.emoji.name == '⬅') {
						pageindex--;
						if (pageindex < 0) pageindex = response.length - 1;
						const page = showpage(response[pageindex], message, pageindex, response.length);
						msg.edit(page);
					}

					if (reaction.emoji.name == '🔄') {
						pageindex = Math.floor(Math.random() * response.length);
						const page = showpage(response[pageindex], message, pageindex, response.length);
						msg.edit(page);
					}

				})
				.on('end', () => {
					if (channel.type === 'dm') return;
					else msg.reactions.removeAll();
				})

		}
		catch (error) {
			console.log(error);
			return channel.send(error);
		}
	}
}

const noResults = new MessageEmbed()
	.setTitle('❌ No encontré nada con los tags que ingresaste.')
	.setDescription('Nota: No puedes hacer una búsqueda con más de 3 tags debido a limitaciones de la api.')
	.setColor('RED');

const ratings = (rating) => {

	const r = {
		e: "Explícito",
		q: "Cuestionable",
		s: "Seguro"
	}

	return r[rating] || 'Desconocido';
};

/**
 * 
 * @param {YanderePost} post
 * @param {Message} message 
 * @param {number} index 
 * @param {number} total 
 */
const showpage = (post, message, index, total) => {
	const tags = post.tags.split(" ").slice(0, 10).join(", ").replace(/_/g, " ");
	const embed = new MessageEmbed()
		.setAuthor(`->Full Resolución<-`, null, post.file_url)
		.setDescription(`**Resolución:** ${post.sample_width}x${post.sample_height} **Rating:** ${ratings(post.rating)}\n**Tags:** ${tags}`)
		.setImage(post.sample_url)
		.setFooter(`[${index + 1} de ${total}] - Post ID: ${post.id}`, message.author.displayAvatarURL({ size: 64 }))
		.setTimestamp();

	if (message.channel.type === 'dm') embed.setColor('BLUE');
	else embed.setColor(message.member.displayColor)

	return embed;
}


module.exports = YandereCommand;