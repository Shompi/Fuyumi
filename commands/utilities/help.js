//@ts-check
const { stripIndents, oneLine } = require('common-tags');
const { Command, CommandoMessage } = require('discord.js-commando');
const { disambiguation } = require('discord.js-commando/src/util');

const { MessageEmbed, Util } = require('discord.js');

/**
 * @param {Command[]} commands
 * @param {string} prefix
 */
const constructEmbed = (commands, prefix) => {
  let aliases;
  let commandName = commands[0].name;
  let description = stripIndents`
					${oneLine`
						__**Descripción:**__\n${commands[0].description}
						${commands[0].guildOnly ? ' (Solo funciona en Servidores)' : ''}
						${commands[0].nsfw ? ' **(NSFW)**' : ''}
					`}`;

  if (commands[0].aliases.length > 0)
    aliases = `\nAliases: ${commands[0].aliases.join(', ')}`;

  if (commands[0].examples)
    description += `\n\n__**Ejemplos:**__\n\`\`\`${commands[0].examples.map(example => `${prefix}${example}`).join('\n')}\`\`\``;

  if (commands[0].details)
    description += `\n\n__**Detalles:**__\n${commands[0].details}`;

  const embed = new MessageEmbed()
    .setDescription(description)
    .setColor("BLUE")
    .setFooter(aliases)
    .setTitle(`Comando ${commandName.toUpperCase()}`);

  return embed;
}


module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      group: 'utilities',
      memberName: 'help',
      aliases: ['commands', 'comandos'],
      description: 'Muestra la lista de comandos disponibles, o información detallada del comando especificado.',
      details: oneLine`
        El comando debe ser parte del nombre de un comando o el nombre completo.
        Si el nombre no es especificado, se listarán todos los comandos disponibles.
			`,
      examples: ['help', 'help prefix'],
      guarded: true,
      args: [
        {
          key: 'command',
          prompt: '¿Que comando quieres consultar?',
          type: 'string',
          default: ''
        }
      ]
    });
  }

  /**@param {CommandoMessage} msg */
  async run(msg, args) { // eslint-disable-line complexity
    const commands = this.client.registry.findCommands(args.command, false, msg);
    const showAll = args.command && args.command.toLowerCase() === 'all';


    console.log("HELP");
    // @ts-ignore
    const prefix = msg.client.db.guildConfigs.get(msg.guild?.id)?.prefix ?? "muki!";
    console.log(prefix);
    if (args.command && !showAll) {
      if (commands.length === 1) {
        let help = constructEmbed(commands, prefix);

        const messages = [];

        try {
          messages.push(await msg.direct(help));
          if (msg.channel.type !== 'dm') messages.push(await msg.reply('Te envié un mensaje directo con más información.'));
        } catch (err) {
          messages.push(await msg.reply('No pude enviarte mis comandos por DM, probablemente los tienes desactivados.'));
        }

        return undefined;

      } else if (commands.length > 15) {
        return msg.reply('Se encontraron multiples coincidencias, por favor se un poco más especifico.');

      } else if (commands.length > 1) {
        return msg.reply(disambiguation(commands, 'commands'));

      } else {
        return msg.reply(
          `No pude identificar el comando. Usa ${msg.usage(
            null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
          )} para ver mi lista de comandos.`
        );
      }

    } else {


      try {
        console.log("110");
        const description = this.client.registry.groups.map(group => {

          if (['Commands', 'Utility'].includes(group.name) || group.commands.size === 0) return;
          // Cada grupo de comandos
          let description = '';

          description += `\n**__${group.name}__**\n\n`;

          description += group.commands.map(command => `**${command.name}**: ${command.description}\n${command.examples?.length >= 1 ? `\`${command.examples.join(" \| ")}\n\`` : '\n'}`).join("\n");


          return description;
        }).join("");


        const splitted = Util.splitMessage(description, { char: "\n", maxLength: 1950 });

        for (const chunk of splitted) {
          await msg.channel.send(
            new MessageEmbed()
              .setDescription(chunk)
              .setColor("BLUE")
          );
        }

        return;

      } catch (err) {
        console.log(err);
        await msg.reply('No pude enviarte mis comandos directamente, probablemente tienes los mensajes directos desactivados.');
      }
      return;
    }
  }
};
