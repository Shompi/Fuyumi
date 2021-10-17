const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./config.json');
const { stable: token } = require('../Keys/auth');

const commands = [];

const commandFiles = fs.readdirSync('./Listeners/Interactions/Commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`../Listeners/Interactions/Commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log(`Successfully registered ${commandFiles.length} application commands.`))
  .catch(console.error);