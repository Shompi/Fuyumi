/*----------------------MODULOS PRINCIPALES---------------------------*/
const { MessageEmbed, Collection } = require('discord.js');
const MukiClient = require('./Classes/MukiClient');
const auth = require('./Keys/auth').stable;
const fs = require('fs');
const GuildConfig = require('./Classes/GuildConfig');
const cooldowns = new Collection();
const Muki = new MukiClient({
  presence: {
    status: "online",
    activity: {
      name: "en Cuarentena",
      type: "PLAYING",
    }
  },
  token: auth
});

const commandFiles = fs.readdirSync('./Commands/Commands').filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./Commands/Commands/${file}`);
  Muki.commands.set(command.name, command);
}

/*-------------------------Inicio del BOT-------------------------*/
const notNSFW = new MessageEmbed()
  .setTitle(`🛑 ¡Alto ahí!`)
  .setDescription(`¡Solo puedes utilizar este comando en canales **NSFW**!`)
  .setColor("RED");

const cmdNotEnabled = (author) =>
  new MessageEmbed()
    .setTitle(`🔌 ${author.username}`)
    .setDescription("Este comando esta deshabilitado globalmente.")
    .setColor('RED');

const noCommandFound = (author) =>
  new MessageEmbed()
    .setTitle(`🔎 ERROR: 404`)
    .setDescription(`**${author}**, ¡No tengo un comando con ese nombre!`)
    .setColor("YELLOW");

Muki.on('message', async (message) => {
  try {
    if (message.partial)
      await message.fetch();

    const { author, guild, channel } = message;

    //if (!guild) return console.log(`${author.tag} ha enviado un mensaje através de un DM.`);

    if (author.bot) return;

    //Actual bot behaviour
    //If the guild is not on the database
    if (guild && !Muki.db.guildConfigs.has(guild.id)) {
      console.log(`La guild ${guild.name} no estaba en la base de datos.`);
      const guildConfig = new GuildConfig(guild);

      Muki.db.guildConfigs.set(guild.id, guildConfig);
    }

    let prefix, startsWithMention = false;

    if (guild) prefix = Muki.db.guildConfigs.get(guild.id).prefix;
    else prefix = "muki!";

    const firstWord = message.content.split(" ")[0];

    if (!firstWord) //If the message doesnt have content.
      return;

    if ([`<@${Muki.user.id}>`, `<@!${Muki.user.id}>`].includes(firstWord))
      startsWithMention = true;

    if (message.content.startsWith(prefix) || startsWithMention) {

      let args;

      if (startsWithMention)
        args = message.content.split(/ +/).slice(1);
      else
        args = message.content.slice(prefix.length).split(/ +/);

      if (args.length == 0)
        return channel.send(`**Mi prefijo es:** \`${prefix}\``);


      console.log(args);
      const commandName = args.shift().toLowerCase();
      const command = Muki.commands.get(commandName) || Muki.commands.find(c => c.aliases.includes(commandName));
      if (!command) return channel.send(noCommandFound(author));

      //Specific commands.

      //Check channel id (fivem channel on Exiliados)
      if (channel.id === "707521827403989002" && command.name === 'players')
        return command.execute(message, args);
      //-----------------------------------------
      if (command.botOwnerOnly && author.id !== Muki.OWNER)
        return;

      if (!command.enabled)
        return channel.send(cmdNotEnabled(author));

      if (command.guildOnly && !guild)
        return channel.send("No puedo ejecutar este comando en mensajes privados!");

      if (command.moderationOnly && !message.member.permissions.has(command.permissions, true))
        return;

      if (command.nsfw && !channel.nsfw)
        return channel.send(notNSFW);

      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 2) * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime)
          return;
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

      try {
        return command.execute(message, args);
      }
      catch (e) {
        console.log(e);
        return channel.send("Hubo un error al intentar ejecutar este comando.");
      }
    }

  } catch (error) {
    console.log(error);
    const e = new MessageEmbed()
      .setColor("RED")
      .setTitle("¡Ha ocurrido un error!")
      .setAuthor("Stacktrace")
      .setTimestamp()
      .setDescription(`\`\`\`js\n${error.toString()} \`\`\` `)

    return Muki.channels.cache.get("585990511790391309").send(e);
  }

});

Muki.on('messageDelete', msg => {
  if (msg.partial || !msg.guild) {
    console.log("Se borró un mensaje parcial o el mensaje estaba en Dm's.");
    return;
  }

  if (msg.guild && msg.guild.id !== "537484725896478733") return;

  const embed = new MessageEmbed()
    .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
    .addField("Contenido:", msg.content ? msg.content : "Sin contenido.")
    .setDescription(`Archivos adjuntos: ${msg.attachments.size}`)
    .setFooter(`Mensaje Borrado.`)
    .setColor("RED");

  Muki.channels.cache.get("585990511790391309").send(embed);
});


Muki.on('ready', async () => {
  console.log(`Online en Discord como: ${Muki.user.tag}`);

  try {
    await Muki.user.setPresence(Muki.config.presence);
    console.log(`Bot listo: ${Date()}`);
  } catch (error) {
    console.log(error);
    Muki.emit("error", error);
  }

  Muki.setInterval(() => {
    Muki.user.setPresence(Muki.config.presence).catch(() => console.log("Error setting the presence"));
  }, 1000 * 60 * 30);
});

Muki.on('messageUpdate', async (old, message) => {
  const { guild, author } = message;
  let prefix;
  if (author.bot) return;

  if (!guild) prefix = "muki!";
  else prefix = Muki.db.guildConfigs.get(guild.id).prefix;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();


  if (message.content.startsWith(prefix)) {

    const command = Muki.commands.get(commandName) || Muki.commands.find(c => c.aliases.includes(commandName));
    if (!command) return await channel.send(noCommandFound(author));

    if (command.name !== 'docs') return;

    if (!Muki.Messages.has(message.id)) return;
    try {

      return command.execute(message, args);

    } catch (error) {
      console.log(error);
      message.channel.send("Hubo un error en este comando.");
    }
  }
});

Muki.on('messageReactionAdd', (reaction, user) => {
  Muki.eventhandler.ReactionAdd.Stars(reaction, user);
});

Muki.on('guildMemberRemove', (member) => {
  Muki.eventhandler.Guild.MemberRemove(member);
});

Muki.on('guildMemberAdd', async member => {
  if (member.partial) member = await member.fetch();
  Muki.eventhandler.Guild.MemberAdd(member);
});

Muki.on('voiceStateUpdate', async (old, now) => {
  try {
    await Muki.eventhandler.VoiceStateUpdate.GoLive(old, now);
  } catch (error) {
    console.log(error);
  }
});

Muki.on('presenceUpdate', async (old, now) => { //Tipo Presence
  try {
    if (!old) return;
    await Muki.eventhandler.Presence.Twitch(old, now);

  } catch (e) {
    console.log(e);
  }
});

Muki.on('error', async (error) => {
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

  const PRESENTATION = require('./Commands/Events/Guild/Join');

  const systemChannel = guild.systemChannel;
  if (!systemChannel) {
    const channels = guild.channels.cache.filter(ch => ch.type === 'text' && ch.permissionsFor(guild.me).has('SEND_MESSAGES'));

    if (channels.size > 0)
      channels.random().send(PRESENTATION).catch(console.error);
  }
  else {
    systemChannel.send(PRESENTATION).catch(console.error);
  }

  const joinedGuild = new MessageEmbed()
    .setAuthor(`${guild.name} (${guild.id})`, guild.iconURL({ size: 64 }))
    .setDescription(`Miembros: ${guild.memberCount}\nDueño: ${guild.owner.user.tag} (${guild.ownerID})\nCanales: ${guild.channels.cache.size}`)
    .setFooter("GUILD_CREATE")
    .setColor("GREEN");

  return Muki.channels.cache.get("585990511790391309").send(joinedGuild);
});

Muki.on('guildDelete', (guild) => {

  const leavedGuild = new MessageEmbed()
    .setAuthor(`${guild.name} (${guild.id})`, guild.iconURL({ size: 64 }))
    .setDescription(`Miembros: ${guild.memberCount}\nDueño: ${guild.owner.user.tag} (${guild.ownerID})\nCanales: ${guild.channels.cache.size}`)
    .setFooter("GUILD_DELETE")
    .setColor("ORANGE");

  return Muki.channels.cache.get("585990511790391309").send(leavedGuild);
});



Muki.ws.on('RESUMED', (data, shard) => {
  console.log("Websocket Resumed");
  console.log(`${data}`);
  console.log(`${shard}`);
});

console.log("Iniciando sesión en Discord...");

Muki.login(Muki.config.token);