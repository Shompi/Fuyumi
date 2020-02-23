/*----------------------MODULOS PRINCIPALES---------------------------*/
const Discord = require('discord.js');
const Muki = new Discord.Client({ partials: ['GUILD_MEMBER'] });
Muki.commands = new Discord.Collection();
Muki.EventHandlers = require('./Commands/EventHandlers');
Muki.NASA = require('./Commands/NASA/POTD');
const fs = require('fs');
const commandFiles = fs.readdirSync('./Commands/Commands').filter(file => file.endsWith(".js"));
const auth = require('./Keys/auth').mukiDev;

for (const file of commandFiles) {
  const command = require(`./Commands/Commands/${file}`);
  Muki.commands.set(command.name, command);
}

/*-----------------------Archivos extra----------------------------*/
let MukiConfigs = { status: "ONLINE", activityType: "PLAYING", activityTo: "muki!", prefix: "muki!" };
//const Muki = require('./Modules/Modules');
const WebHooks = require('./Keys/hookTokens');
const database = require('./Commands/LoadDatabase');
/*-------------------------Inicio del BOT-------------------------*/
let australGamingMemeHook = new Discord.Webhook();
let NASAWebHook = new Discord.Webhook();

const notNSFW = new Discord.MessageEmbed()
  .setTitle(`🛑 ¡Alto ahí!`)
  .setDescription(`¡Solo puedes utilizar este comando en canales **NSFW**!`)
  .setColor("RED");

const cmdNotEnabled = (author) =>
  new Discord.MessageEmbed()
    .setTitle(`🔌 ${author.username}`)
    .setDescription("Este comando esta deshabilitado globalmente.")
    .setColor('RED');

const noCommandFound = (author) =>
  new Discord.MessageEmbed()
    .setTitle(`🔎 ERROR: 404`)
    .setDescription(`**${author}**, ¡No tengo un comando con ese nombre!`)
    .setColor("YELLOW");


const pokecordFilter = async (message) => {
  const { author, guild } = message;
  if (author.id === '365975655608745985' && guild.id === "537484725896478733") {
    await message.delete({ timeout: 10000, reason: "Pokecord" });
  }
}

Muki.on('message', async (message) => {
  try {
    const { author, guild, channel, mentions } = message;

    if (!guild) return console.log(`${author.tag} ha enviado un mensaje através de un DM.`);
    pokecordFilter(message);
    if (author.bot) return;

    //Webhooks
    if (channel.id == '622889689472303120') {
      if (message.attachments.size <= 0 || author.bot) return;
      const { name, url } = message.attachments.first();
      const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`${author.tag}`, author.displayAvatarURL({ size: 64 }))
        .setTitle(message.content)
        .setFooter(`Enviado desde: ${guild.name}`, `${guild.iconURL({ size: 64 })}`);

      if (name.endsWith(".mp4") || name.endsWith(".webm")) embed.attachFiles([url])
      else embed.setImage(url);

      await australGamingMemeHook.send(null, { embeds: [embed], avatarURL: guild.iconURL(), username: guild.name });
      return await CotorrasMemeHook.send(null, { embeds: [embed], avatarURL: guild.iconURL(), username: guild.name });
    }

    //Actual bot behaviour
    const prefix = database.guildConfigs.get(guild.id).prefix;

    if (mentions.has(Muki.user))
      return await channel.send(new Discord.MessageEmbed()
        .setColor("BLUE")
        .setDescription(`Mi prefijo en **${guild.name}** es: **${prefix}**`));


    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();


    if (message.content.startsWith(prefix)) {

      const command = Muki.commands.get(commandName) || Muki.commands.find(c => c.aliases.includes(commandName));
      if (!command) return await channel.send(noCommandFound(author));

      if (!command.enabled) return await channel.send(cmdNotEnabled(author));
      if (command.nsfw && !channel.nsfw) return await channel.send(notNSFW);

      return command.execute(message, args);

    } else {
      //Other stuff im trying to plan.
    }


  } catch (error) {
    console.log(error);
    const e = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("¡Ha ocurrido un error!")
      .setAuthor("Stacktrace")
      .setTimestamp()
      .setDescription(`\`\`\`js\n${error.toString()} \`\`\` `)

    return await Muki.channels.cache.get("585990511790391309").send(e);
  }

});

Muki.on('messageUpdate', async (old, now) => {
  return;
  if (now.author.bot) return;
  const prefix = database.guildConfigs.get(guild.id).prefix;
  try {
    if (old.content.startsWith(prefix) && now.content.startsWith(prefix)) {

      const args = content.slice(prefix.length).split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = Muki.commands.get(commandName) || Muki.commands.find(c => c.aliases.includes(commandName));
      if (!command) return await MukiMessage.edit(noCommandFound(author));
      if (!command.enabled) return await MukiMessage.edit(cmdNotEnabled(author));
      if (command.nsfw && !channel.nsfw) return await MukiMessage.edit(notNSFW);
      if (command.name != 'docs') return;

      return command.execute(now, args);
    }


  } catch (error) {
    console.log(error);
    Muki.channels.cache.get("585990511790391309").send(error.message);
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
      if (database.guildConfigs.has(guild.id)) return console.log(`La guild ${guild.name} ya tenia una entrada de configuración.\n${database.guildConfigs.get(guild.id)}`);

      const guildConfig = {
        id: guild.id,
        name: guild.name,
        prefix: "muki!",
        welcome: {
          enabled: false,
          channelID: null,
          joinPhrases: [],
          leavePhrases: []
        }
      };
      database.guildConfigs.set(guild.id, guildConfig);
      console.log(`Entrada para ${guild.name} creada!`);
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

Muki.on('guildMemberRemove', async (member) => {
  await Muki.EventHandlers.Guild.MemberRemove(member, Muki);
});

Muki.on('guildMemberAdd', async member => {
  if (member.partial) member = await member.fetch();
  await Muki.EventHandlers.Guild.MemberAdd(member, Muki);
});

Muki.on('voiceStateUpdate', async (old, now) => {
  try {
    await Muki.EventHandlers.Presence.GoLive(old, now, Muki);
  } catch (error) {
    console.log(error);
  }
});

Muki.on('presenceUpdate', async (old, now) => { //Tipo Presence
  try {
    if (!old) return;
    await Muki.EventHandlers.Presence.Twitch(old, now);

  } catch (e) {
    console.log(e);
  }
});

Muki.on('guildBanAdd', async (guild, user) => {
  if (!guild.systemChannel) return;
  const embed = new Discord.MessageEmbed()
    .setAuthor(user.tag, user.displayAvatarURL({ size: 256 }))
    .setDescription(`Ha sido baneado de **${guild.name}**`)
    .setColor('RED')
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .setTimestamp();

  return await guild.systemChannel.send(embed);
});

Muki.on('error', async (error) => {
  console.log(error)
  const e = new Discord.MessageEmbed().setColor("RED").setDescription(`${error}\n${error.stack}`);
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

  const guildConfig = {
    prefix: "muki!",
    welcome: {
      enabled: false,
      channelID: null,
      joinPhrases: [],
      leavePhrases: []
    }
  }

  database.guildConfigs.set(guild.id, guildConfig);
  const channel = guild.systemChannel;
  const embed = new Discord.MessageEmbed()
    .setTitle(`¡Hola!, mi prefijo es ${guildConfig.prefix}`)
    .setDescription(
      'Mi pequeña lista de comandos:\n' +
      'NSFW:\n' +
      '**neko**\n' +
      '**lewd**\n' +
      '**dere** <tag>\n' +
      '**kona** <tag>\n' +
      '**Otros:** ngif, erok, erofeet, les, yuri, feetg, eroyuri, kuni, tits, pussy.\n' +
      'SFW:\n' +
      '**tag** <palabra>\n' +
      '**meow**\n\n' +
      '¡Recuerda que **todos** mis comandos comienzan con mi prefijo!'
    )
    .setColor("BLUE")
    .setFooter("Dudas, sugerencias o peticiones hablar con MukiFlen#3338")
  if (!channel) return await guild.owner.send(embed);
  else await channel.send(embed);
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

Muki.login(auth);