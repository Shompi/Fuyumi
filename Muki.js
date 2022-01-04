const MukiClient = require('./Classes/MukiClient');
const fs = require('fs');
const client = new MukiClient();

/** Cargar los slash commands */
const slashCommandsFiles = fs.readdirSync('./listeners/Interactions/Commands').filter(file => file.endsWith('.js') && file.startsWith('cmd-'));

for (const filename of slashCommandsFiles) {
  const command = require(`./listeners/Interactions/Commands/${filename}`);

  client.commands.set(command.data.name, command);
}

/** Cargar los comandos en menú de contexto */
const contextMenuFiles = fs.readdirSync('./listeners/Interactions/Commands').filter(file => file.startsWith('ctx-') && file.endsWith('.js'));

for (const filename of contextMenuFiles) {
  const command = require(`./listeners/Interactions/Commands/${filename}`);

  client.contextCommands.set(command.data.name, command);
}

console.log(`Se cargaron ${slashCommandsFiles.length} slash commands!`);
console.log(`Se cargaron ${contextMenuFiles.length} comandos de Menú Contextual!`);


client.addListener('onCommand', ({ commandName, user }) => {
  console.log(`El usuario ${user.tag} usó el comando ${commandName}`);
});


client.login(require('./Keys/auth').stable);