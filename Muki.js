/*----------------------MODULOS PRINCIPALES---------------------------*/
const { Client, Collection, MessageEmbed, Webhook } = require('discord.js');
const Muki = new Client({ partials: ['GUILD_MEMBER'], disableMentions: 'everyone' });
Muki.commands = new Collection();
Muki.EventHandlers = require('./Commands/EventHandlers');
Muki.NASA = require('./Commands/NASA/POTD');
Muki.OWNER = '166263335220805634';
Muki.replies = new Collection();
const fs = require('fs');
const commandFiles = fs.readdirSync('./Commands/Commands').filter(file => file.endsWith(".js"));
const auth = require('./Keys/auth').stable;

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
let australGamingMemeHook = new Webhook();
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

    if (!guild) return console.log(`${author.tag} ha enviado un mensaje através de un DM.`);
    pokecordFilter(message);
    if (author.bot) return;

    //Webhooks
    if (channel.id == '622889689472303120') {
      if (message.attachments.size <= 0 || author.bot) return;
      const { name, url } = message.attachments.first();
      const embed = new MessageEmbed()
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

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();


    if (message.content.startsWith(prefix)) {

      const command = Muki.commands.get(commandName) || Muki.commands.find(c => c.aliases.includes(commandName));
      if (!command) return await channel.send(noCommandFound(author));

      if (!command.enabled) return await channel.send(cmdNotEnabled(author));
      if (command.nsfw && !channel.nsfw) return await channel.send(notNSFW);
      if (command.name === 'eval' && author.id !== Muki.OWNER) return;

      return command.execute(message, args);

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

        return console.log(`La guild ${guild.name} ya tenia una entrada de configuración.\n${database.guildConfigs.get(guild.id)}`);
        let configs = database.guildConfigs.get(guild.id);
        if (configs.adminRole) return;
        configs.adminRole = null;

        database.guildConfigs.set(guild.id, configs);
        console.log(`Configuración de ${guild.name} actualizada!`);
        console.log(configs);

      } else {
        const guildConfig = {
          id: guild.id,
          name: guild.name,
          prefix: "muki!",
          adminRole: null,
          welcome: {
            enabled: false,
            channelID: null,
            joinPhrases: [],
            leavePhrases: []
          }
        };
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

Muki.on('messageReactionAdd', async (reaction, user) => {
  Muki.EventHandlers.ReactionAdd.Stars(reaction, user);
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

  const guildConfig = {
    id: guild.id,
    name: guild.name,
    prefix: "muki!",
    adminRole: null,
    welcome: {
      enabled: false,
      channelID: null,
      joinPhrases: [],
      leavePhrases: []
    }
  }

  database.guildConfigs.set(guild.id, guildConfig);

  return await Muki.channels.cache.get("585990511790391309").send(`Nueva Guild ${guild.name} (${guild.id})!`);
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