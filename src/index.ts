import * as dotenv from "dotenv"
dotenv.config()

import { SapphireClient } from "@sapphire/framework"
import { GatewayIntentBits } from "discord.js"
import '@sapphire/plugin-hmr/register'


const client = new SapphireClient(
	{
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildEmojisAndStickers,
			GatewayIntentBits.GuildMessages
		]
	}
)
console.log('TOKEN', process.env.BOT_TOKEN?.slice(0, 10));


await client.login(process.env.BOT_TOKEN)