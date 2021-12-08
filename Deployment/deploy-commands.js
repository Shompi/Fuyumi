const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./config.json');
const { stable: token } = require('../Keys/auth');

const commands = [];
const globalCommands = [];
const commandFiles = fs.readdirSync('./Listeners/Interactions/Commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`../Listeners/Interactions/Commands/${file}`);
  if (command.isGlobal) {
    globalCommands.push(command.data.toJSON());
  } else {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '9' }).setToken(token);

async function registerCommands() {
  try {

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log(`Se registraron ${commands.length} comandos de guild`);
    await rest.put(Routes.applicationCommands(clientId), { body: globalCommands });
    console.log(`Se registraron ${globalCommands.length} comandos globales`);

  } catch (e) { (console.error(e)) }
}

async function deploySpecific(specificId) {
  await rest.put(Routes.applicationGuildCommands(clientId, specificId), { body: commands });
  console.log(`Se registraron ${commands.length} comandos de guild especifica`);
}

registerCommands().then(() => deploySpecific("595820458494918686"));
