const { REST } = require('@discordjs/rest');
const { Routes, ApplicationCommandPermissionType } = require('discord-api-types/v9');
const { MessageEmbed, Util } = require('discord.js');
const restClient = new REST().setToken(require('./Keys/auth').stable);


restClient.put(Routes.applicationCommandPermissions(require('./Deployment/config.json').clientId, require('./Deployment/config.json').guildId, "928451908916621342"), {
  body: {
    permissions: [
      {
        id: '832708770122956861',
        type: ApplicationCommandPermissionType.User,
        permission: true
      },
      {
        id: "166263335220805634",
        type: ApplicationCommandPermissionType.User,
        permission: true

      }
    ]
  }
}).then(response => {
  console.log(response)
  console.log("---------------------")
})