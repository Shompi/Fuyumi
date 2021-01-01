/*----------------------MODULOS PRINCIPALES---------------------------*/
const { MessageEmbed, Collection } = require('discord.js');
const MukiClient = require('./Classes/MukiClient');
const Muki = new MukiClient();
const auth = require('./Keys/auth').stable;
const fs = require('fs');

const commandFiles = fs.readdirSync('./Commands/Commands').filter(file => file.endsWith(".js"));
const eventFolders = fs.readdirSync("./Events"); //Esto retornará los nombres de las carpetas.

//Carga de comandos
for (const file of commandFiles) {
  const command = require(`./Commands/Commands/${file}`);
  Muki.commands.set(command.name, command);
}

//Carga de eventos
for (const foldername of eventFolders) {

  const eventFiles = fs.readdirSync(`./Events/${foldername}`).filter(file => file.endsWith(".js"));

  for (const eventFile of eventFiles) {
    const handler = require(`./Events/${foldername}/${eventFile}`);
    Muki.events.set(handler.name, handler);
  }
}


/*-------------------------Inicio del BOT-------------------------*/

// #region messageEvent
Muki.on('message', (message) => {
  Muki.events.get('message')?.execute(message);
});
//#endregion

Muki.on('ready', () => {

  Muki.events.get('ready')?.execute(Muki);
});

Muki.on('messageUpdate', (old, message) => {
  Muki.events.get("messageUpdate")?.execute(old, message);
});

Muki.on('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial)
    await reaction.fetch();

  if (user.partial)
    await user.fetch();

  Muki.events.get("messageReactionAdd")?.execute(reaction, user);
});

Muki.on('guildMemberRemove', async (member) => {

  if (member.partial)
    await member.fetch();

  Muki.events.get('guildMemberRemove')?.execute(member);
});

Muki.on('guildMemberAdd', async member => {
  if (member.partial)
    await member.fetch();

  Muki.events.get('guildMemberAdd')?.execute(member);
});

Muki.on('voiceStateUpdate', (old, now) => {

  Muki.events.get('voiceStateUpdate')?.execute(old, now);
});

Muki.on('presenceUpdate', (old, now) => { //Tipo Presence
  Muki.events.get('presenceUpdate')?.execute(old, now);
});

Muki.on('error', (error) => {
  console.log(error)
  const e = new MessageEmbed().setColor("RED").setDescription(`${error}\n${error.stack}`);
  return Muki.channels.cache.get("585990511790391309").send(e).catch(console.error);
});

Muki.on('reconnecting', () => {
  console.log('El bot se está reconectando...');
});

Muki.on('resume', (Replayed) => {
  console.log(`Muki se ha reconectado, numero de eventos repetidos: ${Replayed}`);
});

Muki.on('warn', (warn) => {
  console.log("Advertencia recibida:");
  console.log(warn);
});

Muki.on('guildCreate', (guild) => {
  Muki.events.get('guildCreate')?.execute(guild);
});

Muki.on('guildDelete', (guild) => {
  Muki.events.get('guildDelete')?.execute(guild);
});

Muki.ws.on('RESUMED', (data, shard) => {
  console.log("Websocket Resumed");
  console.log(`${JSON.stringify(data)}`);
  console.log(`${shard}`);
});

console.log("Iniciando sesión en Discord...");
Muki.login(auth);