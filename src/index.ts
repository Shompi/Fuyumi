import { SapphireClient } from "@sapphire/framework"
import { GatewayIntentBits } from "discord.js"
// import '@sapphire/plugin-hmr/register'


const client = new SapphireClient(
	{
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildExpressions,
			GatewayIntentBits.GuildVoiceStates,
		],
	}
)

client.exiliados = "537484725896478733"
client.development = "941843371062861855"

console.log('TOKEN', Bun.env["BOT_TOKEN"]?.slice(0, 10));


await client.login(Bun.env["BOT_TOKEN"])