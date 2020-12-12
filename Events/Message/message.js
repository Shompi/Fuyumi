const { Message, MessageEmbed, Collection } = require('discord.js');
const { basename } = require('path');
const cooldowns = new Collection();
const GuildConfig = require('../../Classes/GuildConfig');

const notNSFW = new MessageEmbed()
  .setTitle(`🛑 ¡Alto ahí!`)
  .setDescription(`¡Solo puedes utilizar este comando en canales **NSFW**!`)
  .setColor("RED");

const cmdNotEnabled = (author) =>
  new MessageEmbed()
    .setTitle(`🔌 ${author.username}`)
    .setDescription("Este comando esta deshabilitado globalmente.")
    .setColor('RED');

const noCommandFound = (author) =>
  new MessageEmbed()
    .setTitle(`🔎 ERROR: 404`)
    .setDescription(`**${author}**, ¡No tengo un comando con ese nombre!`)
    .setColor("YELLOW");

module.exports = {
  name: "message",
  filename: basename(__filename),
  path: __filename,
  hasTimers: false,
  /**
  *@param {Message} message
  */
  async execute(message) {
    /*Code Here*/
    try {
      const { author, guild, channel, client: Muki } = message;

      if (author.bot) return;

      if (guild && !Muki.db.guildConfigs.has(guild.id)) {
        console.log(`La guild ${guild.name} no estaba en la base de datos.`);
        const guildConfig = new GuildConfig(guild);

        Muki.db.guildConfigs.set(guild.id, guildConfig);
      }

      let prefix, startsWithMention = false;

      if (guild) prefix = Muki.db.guildConfigs.get(guild.id).prefix;
      else prefix = "muki!";

      const firstWord = message.content.split(" ")[0];

      if (!firstWord) //If the message doesnt have content.
        return;

      if ([`<@${Muki.user.id}>`, `<@!${Muki.user.id}>`].includes(firstWord))
        startsWithMention = true;

      if (message.content.startsWith(prefix) || startsWithMention) {

        let args;

        if (startsWithMention)
          args = message.content.split(/ +/).slice(1);
        else
          args = message.content.slice(prefix.length).split(/ +/);

        if (args.length == 0)
          return channel.send(`**Mi prefijo es:** \`${prefix}\``);


        console.log(args);
        const commandName = args.shift().toLowerCase();
        const command = Muki.commands.get(commandName) || Muki.commands.find(c => c.aliases.includes(commandName));
        if (!command) return channel.send(noCommandFound(author));

        //Specific commands.

        //Check channel id (fivem channel on Exiliados)
        if (channel.id === "707521827403989002" && command.name === 'players')
          return command.execute(message, args);
        //-----------------------------------------
        if (command.botOwnerOnly && author.id !== Muki.OWNER)
          return;

        if (!command.enabled && author.id !== Muki.OWNER)
          return channel.send(cmdNotEnabled(author));

        if (command.guildOnly && !guild)
          return channel.send("No puedo ejecutar este comando en mensajes privados!");

        if (command.moderationOnly && !message.member.permissions.has(command.permissions, true))
          return;

        if (command.nsfw && !channel.nsfw)
          return channel.send(notNSFW);

        if (!cooldowns.has(command.name)) {
          cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 2) * 1000;

        if (timestamps.has(message.author.id)) {
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

          if (now < expirationTime)
            return;
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
          return command.execute(message, args);
        }
        catch (e) {
          console.log(e);
          return channel.send("Hubo un error al intentar ejecutar este comando.");
        }
      }

    } catch (error) {
      console.log(error);
      const e = new MessageEmbed()
        .setColor("RED")
        .setTitle("¡Ha ocurrido un error!")
        .setAuthor("Stacktrace")
        .setTimestamp()
        .setDescription(`\`\`\`js\n${error.toString()} \`\`\` `)

      return Muki.channels.cache.get("585990511790391309").send(e);
    }
  }
}