require('dotenv').config();
const Client = require('./Classes/Client');
const fs = require('fs');
const client = new Client();

/** Cargar los slash commands */
const applicationCommandsFiles = fs.readdirSync('./InteractionCommands').filter(file => file.endsWith('.js'));


for (const filename of applicationCommandsFiles) {

  const command = require(`./InteractionCommands/${filename}`);

  client.commands.set(command.data.name, command);
}

console.log(`Se cargaron ${applicationCommandsFiles.length} slash commands!`);
client.on('commandReload', ({ commandName, channelId }) => {

  const slashCommandsFiles = fs.readdirSync('./InteractionCommands').filter(file => file.endsWith('.js'));

  for (const filename of slashCommandsFiles) {

    // Leer el archivo para poder encontrar el comando por su nombre
    const command = require(`./InteractionCommands/${filename}`);

    if (command.data.name === commandName) {

      // Borramos el comando de la colección
      client.commands.delete(commandName);

      // Buscamos el path del archivo dentro de las keys de require.cache
      const commandPath = Object.keys(require.cache).find(key => key.endsWith(filename));

      // Borramos el cache de los subcommands en caso de que el comando tenga subcomandos.
      if (command.hasSubcommands) {
        command.subcommands.forEach(path => {
          const subcommandPath = Object.keys(require.cache).find(key => key.endsWith(path));
          delete require.cache[subcommandPath];
        });
      }

      // Borramos el cache del archivo
      delete require.cache[commandPath];

      // Cargamos el archivo nuevamente
      const freshCommand = require(`./InteractionCommands/${filename}`);

      // Agregamos el comando a la colección de comandos
      client.commands.set(command.data.name, freshCommand);

      return client.channels.cache.get(channelId).send({ content: `El comando ${commandName} ha sido reiniciado!` });
    }
  }

  return client.channels.cache.get(channelId).send({ content: 'No se encontró ningún comando con ese nombre.' });
});

client.login(process.env.BOT_TOKEN);