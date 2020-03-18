/*----------------------MODULOS PRINCIPALES---------------------------*/
const { MessageEmbed, Webhook } = require('discord.js');
const MukiClient = require('./Classes/MukiClient');
const auth = require('./Keys/auth').beta;
const fs = require('fs');
const GuildConfig = require('./Classes/GuildConfig');

const Muki = new MukiClient({
  status: "online",
  activityType: "LISTENING",
  activityTo: "nothing",
  prefix: "muki!",
  token: auth
});



/* new Client({ partials: ['GUILD_MEMBER'], disableMentions: 'everyone' });
Muki.commands = new Collection();
Muki.EventHandlers = require('./Commands/EventHandlers');
Muki.NASA = require('./Commands/NASA/POTD');
Muki.OWNER = '166263335220805634';
Muki.Messages = new Collection(); */
const commandFiles = fs.readdirSync('./Commands/Commands').filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./Commands/Commands/${file}`);
  Muki.commands.set(command.name, command);
}

/*-----------------------Archivos extra----------------------------*/
// const WebHooks = require('./Keys/hookTokens');
const database = require('./Commands/LoadDatabase');
/*-------------------------Inicio del BOT-------------------------*/
let australGamingMemeHook = new Webhook();
let CotorrasMemeHook = new Webhook();
let NASAWebHook = new Webhook();

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


const pokecordFilter = async (message) => {
  const { author, guild, channel } = message;
  if (author.id === '365975655608745985' && guild.id === "537484725896478733" && channel.id !== '585990511790391309') {
    await message.delete({ timeout: 10000, reason: "Pokecord" });
  }

  return undefined;
}

Muki.on('message', async (message) => {
  try {
    const { author, guild, channel, mentions } = message;

    //if (!guild) return console.log(`${author.tag} ha enviado un mensaje através de un DM.`);
    pokecordFilter(message);
    if (author.bot) return;

    //Webhooks
    if (channel.id == '622889689472303120') {
      if (message.attachments.size <= 0 || author.bot) return;
      const { attachments } = message;
      const embeds = [];
      for (const attachment of attachments.values()) {

        const { url, name } = attachment;
        const embed = new MessageEmbed()
          .setColor("BLUE")
          .setAuthor(`${author.tag}`, author.displayAvatarURL({ size: 64 }))
          .setFooter(`Enviado desde: ${guild.name}`, `${guild.iconURL({ size: 64 })}`);

        if (name.endsWith(".mp4") || name.endsWith(".webm")) embed.attachFiles([url])
        else embed.setImage(url);

        embeds.push(embed);
      }
      embeds[0].setTitle(message.content);
      await australGamingMemeHook.send(null, { embeds: embeds, avatarURL: guild.iconURL(), username: guild.name });
      return await CotorrasMemeHook.send(null, { embeds: embeds, avatarURL: guild.iconURL(), username: guild.name });
    }

    //Actual bot behaviour
    if (guild && !database.guildConfigs.has(guild.id)) {
      const guildConfig = new GuildConfig(guild);
      database.guildConfigs.set(guild.id, guildConfig);
    }

    let prefix;
    if (guild) prefix = database.guildConfigs.get(guild.id, "prefix");
    else prefix = "muki!";


    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (mentions.users.has(Muki.user.id)) return channel.send(`Mi prefijo es: \`${prefix}\``);

    if (message.content.startsWith(prefix)) {
      try {
        const command = Muki.commands.get(commandName) || Muki.commands.find(c => c.aliases.includes(commandName));
        if (!command) return channel.send(noCommandFound(author));

        if (!command.enabled) return channel.send(cmdNotEnabled(author));
        if (command.nsfw && !channel.nsfw) return channel.send(notNSFW);
        if (command.name === 'eval' && author.id !== Muki.OWNER) return;
        if (command.guildOnly && channel.type !== 'text') return channel.send("No puedo ejecutar este comando en mensajes privados!");
        return command.execute(message, args);
      }
      catch (e) {
        console.log(e);
        return channel.send("Hubo un error al intentar ejecutar este comando.");
      }

    } else {
      //Other stuff im trying to plan.
    }


  } catch (error) {
    console.log(error);
    const e = new MessageEmbed()
      .setColor("RED")
      .setTitle("¡Ha ocurrido un error!")
      .setAuthor("Stacktrace")
      .setTimestamp()
      .setDescription(`\`\`\`js\n${error.toString()} \`\`\` `)

    return await Muki.channels.cache.get("585990511790391309").send(e);
  }

});

Muki.on('ready', async () => {
  console.log(`Online en Discord como: ${Muki.user.tag}`);
  return;
  try {
    console.log("Fetching Hook de Austral Gaming...");
    australGamingMemeHook = await Muki.fetchWebhook(WebHooks.AGMemeHook.id, WebHooks.AGMemeHook.token);
    console.log("Fetching Hook de NASA...");
    NASAWebHook = await Muki.fetchWebhook(WebHooks.NASAHook.id);
    console.log("Fetching Hook de Cotorras Gaming...");
    CotorrasMemeHook = await Muki.fetchWebhook(WebHooks.CotorrasMemeHook.id, WebHooks.CotorrasMemeHook.token);
    if (!database.MukiSettings.has('settings'))
      database.MukiSettings.set('settings', MukiConfigs);

    await Muki.user.setPresence({
      activity: {
        name: `${Muki.users.cache.size} users!`,
        type: "LISTENING"
      },
      status: database.MukiSettings.get("settings", "status") || "online"
    });

    Muki.guilds.cache.forEach(guild => {
      if (database.guildConfigs.has(guild.id)) {
        return;
      } else {
        const guildConfig = new GuildConfig(guild);

        database.guildConfigs.set(guild.id, guildConfig);
        console.log(`Entrada para ${guild.name} creada!`);
      }
    });

    console.log(`Bot listo: ${Date()}`);

  } catch (error) {
    console.log(error);
    Muki.emit("error", error);
  }
  setImmediate(async () => {
    await Muki.NASA(NASAWebHook).catch(console.error);
    setInterval(async () => {
      await Muki.NASA(NASAWebHook).catch(console.error);
    }, 1000 * 60 * 60);
  });
});

Muki.on('messageUpdate', async (old, message) => {
  const { guild } = message;
  let prefix;
  if (!guild) prefix = "muki!";
  else prefix = database.guildConfigs.get(guild.id, "prefix");
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

Muki.on('messageReactionAdd', async (reaction, user) => {
  Muki.eventhandler.ReactionAdd.Stars(reaction, user);
});

Muki.on('guildMemberRemove', async (member) => {
  await Muki.eventhandler.Guild.MemberRemove(member);
});

Muki.on('guildMemberAdd', async member => {
  if (member.partial) member = await member.fetch();
  await Muki.eventhandler.Guild.MemberAdd(member);
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

Muki.on('guildBanAdd', async (guild, user) => {
  if (!guild.systemChannel) return;
  const embed = new MessageEmbed()
    .setAuthor(user.tag, user.displayAvatarURL({ size: 256 }))
    .setDescription(`Ha sido baneado de **${guild.name}**`)
    .setColor('RED')
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .setTimestamp();

  return await guild.systemChannel.send(embed);
});

Muki.on('error', async (error) => {
  console.log(error)
  const e = new MessageEmbed().setColor("RED").setDescription(`${error}\n${error.stack}`);
  return await Muki.channels.cache.get("585990511790391309").send(e).catch(console.error);
});

Muki.on('reconnecting', () => {
  console.log('El bot se está reconectando...');
});

Muki.on('resume', (Replayed) => {
  console.log(`Muki se ha reconectado, numero de eventos en Replayed: ${Replayed}`);
});

Muki.on('warn', (warn) => {
  console.log("Advertencia recibida:");
  console.log(warn);
});

Muki.on('guildCreate', async (guild) => {

  const guildConfig = new GuildConfig(guild);

  database.guildConfigs.set(guild.id, guildConfig);

  return Muki.channels.cache.get("585990511790391309").send(`Nueva Guild ${guild.name} (${guild.id})!`);
});

Muki.on('guildDelete', (guild) => {
  database.guildConfigs.delete(guild.id);
  console.log(`El bot ha abandonado la guild ${guild.name}`);
  console.log(`Entrada de configuración:\n${database.guildConfigs.get(guild.id)} (Si es undefined está bien.)`);
});



Muki.ws.on('RESUMED', (data, shard) => {
  console.log("Websocket Resumed");
  console.log(data);
  console.log(shard);
});

console.log("Logging Muki...");

Muki.login(Muki.config.token);