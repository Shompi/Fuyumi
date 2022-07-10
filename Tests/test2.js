require('dotenv').config()
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { } = require('discord.js');
const restClient = new REST().setToken();


async function main() {

  await restClient.put(Routes.channel("541007291718172683"), {
    body: {
      name: "Todas las edades",
      type: 0,
    }
  });
}

main();