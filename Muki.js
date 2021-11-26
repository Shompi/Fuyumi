const MukiClient = require('./Classes/MukiClient');
const fs = require('fs');
const client = new MukiClient();


/** Cargar los slash commands */
const slashCommandsFiles = fs.readdirSync('./listeners/Interactions/Commands').filter(file => file.endsWith('.js') && file.startsWith('cmd-'));

for (const filename of slashCommandsFiles) {
  const command = require(`./listeners/Interactions/Commands/${filename}`);

  client.commands.set(command.data.name, command);
}

console.log(`Se cargaron ${slashCommandsFiles.length} slash commands!`);

client.login(require('./Keys/auth').stable);