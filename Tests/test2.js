require('dotenv').config()
const { REST } = require('@discordjs/rest');
const { Routes, ApplicationCommandPermissionType } = require('discord-api-types/v9');
const { MessageEmbed, Util } = require('discord.js');
const restClient = new REST().setToken(process.env.BOT_TOKEN);