/*----------------------MODULOS PRINCIPALES---------------------------*/
const { CommandoGuild } = require('discord.js-commando');
const fs = require('fs');
const { join } = require('path');
const CommandoClientEx = require('./Classes/CommandoClientExtended');

const Muki = new CommandoClientEx();

// Login.
Muki.login(require('./Keys/auth').ShompiFlen);

// Registrar grupos de comandos
Muki.registry
  .registerDefaultTypes()
  .registerGroups(
    [
      ['images', 'Imágenes'],
      ['utilities', 'Utilidades'],
      ['moderation', 'Moderación']
    ]
  )
  .registerDefaultGroups()
  .registerDefaultCommands({
    help: false,
    ping: false,
    prefix: false,
    unknownCommand: false,
  })
  .registerCommandsIn(join(__dirname, 'commands'))

//Carga de eventos
const eventFolders = fs.readdirSync("./Events"); //Esto retornará los nombres de las carpetas.
for (const foldername of eventFolders) {

  const eventFiles = fs.readdirSync(`./Events/${foldername}`).filter(file => file.endsWith(".js"));

  for (const eventFile of eventFiles) {
    const handler = require(`./Events/${foldername}/${eventFile}`);
    Muki.events.set(handler.name, handler);
  }
}

Muki.on('ready', () => {

  Muki.events.get('ready')?.execute(Muki);
});

Muki.on('error', console.error);

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