/*----------------------MODULOS PRINCIPALES---------------------------*/
const Discord = require('discord.js');
const Muki = new Discord.Client({ partials: ['GUILD_MEMBER'] });
Muki.commands = new Discord.Collection();
const fs = require('fs');
const commandFiles = fs.readdirSync('./Commands/Commands').filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./Commands/Commands/${file}`);
  Muki.commands.set(command.name, command);
}

/*-----------------------Archivos extra----------------------------*/
const auth = require('./Keys/auth').stable;
let MukiConfigs = { status: "ONLINE", activityType: "PLAYING", activityTo: "muki!", prefix: "muki!" };
//const Shompi = require('./Modules/Modules');
const WebHooks = require('./Keys/hookTokens');
const database = require('./Modules/LoadDatabase');
/*-------------------------Inicio del BOT-------------------------*/
const MukiOwnerID = '166263335220805634';
const NekosNSFWEndpoints = require('./Modules/NekosLife/endpoints');
let australGamingMemeHook = new Discord.Webhook();
let NASAWebHook = new Discord.Webhook();
let owoCooldown = false;

const notNSFW = new Discord.MessageEmbed()
  .setTitle(`🛑 ¡Alto ahí!`)
  .setDescription(`¡Solo puedes utilizar este comando en canales **NSFW**!`)
  .setColor("RED");

const cmdNotEnabled = (author) =>
  new Discord.MessageEmbed()
    .setTitle(`🔌 ${author.username}`)
    .setDescription("Este comando esta deshabilitado globalmente.")
    .setColor('RED');


Muki.on('message', async (message) => {
  try {
    const { author, guild, channel, mentions } = message;

    if (!guild) return console.log(`${author.tag} ha enviado un mensaje através de un DM.`);

    //Pokecord messages. Mensajes especificos de bots.
    if (author.id === '365975655608745985' && guild.id === "537484725896478733") {
      message.delete({ timeout: 10000, reason: "Pokecord" });
    }

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

    const prefix = database.guildConfigs.get(guild.id).prefix;

    if (mentions.has(Muki.user))
      return await channel.send(new Discord.MessageEmbed()
        .setColor("BLUE")
        .setDescription(`Mi prefijo en **${guild.name}** es: **${prefix}**`));


    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    //Comandos de usuario con prefijo:
    if (message.content.startsWith(prefix)) {

      const command = Muki.commands.get(commandName);
      if (!command.enabled) return await channel.send(cmdNotEnabled(author));
      if (command.nsfw && !channel.nsfw) return await channel.send(notNSFW);
      
    } else {

      if (command === "invite") return await Muki.generateInvite(607177824).then(invite => channel.send(invite));

      if (command == 'emoji') {
        const emoji = Muki.emojis.cache.find(emoji => emoji.name == content);
        if (!emoji) return await channel.send('No encontré un emoji con ese nombre.');
        await message.delete({ timeout: 1000, reason: 'emoji command' })
        return await channel.send(`${emoji}`);
      }
      if (NekosNSFWEndpoints.includes(command)) return await Shompi.Nekos(message, command);
    }

    if (message.content.toLowerCase().includes("owo") && !owoCooldown) {
      await channel.send("òwó");
      owoCooldown = true;
      setTimeout(() => {
        owoCooldown = false;
      }, 1000 * 60 * 2, owoCooldown);
    }

    //-----------------------------Bot Owner commands------------------------------//
    if (author.id === MukiOwnerID && message.content[0] === '*') {
      const command = message.content.split(" ").slice(1)[0];
      const content = message.content.split(" ").slice(2).join(" ");
      if (command == 'status') {
        await Muki.user.setStatus(content);
        database.MukiSettings.set("settings", content, "status");
      }
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

//------------------------Muki listener on GuildMemberRemove ------------------------//
Muki.on('guildMemberRemove', async (member) => {
  await Shompi.eventHandlers.Guild.MemberRemove(member, Muki);
});

//------------------------Muki listener on GuildMemberAdd ------------------------//
Muki.on('guildMemberAdd', async member => {
  if (member.partial) member = await member.fetch();
  await Shompi.eventHandlers.Guild.MemberAdd(member, Muki);
});

//------------------------Muki listener on guildMemberUpdate ------------------------//
Muki.on('guildMemberUpdate', async (oldMember, newMember) => {
});

Muki.on('voiceStateUpdate', async (old, now) => {
  try {
    await Shompi.eventHandlers.Presence.GoLive(old, now, Muki);
  } catch (error) {
    console.log(error);
  }
});
//------------------------User Presence Change------------------------//
Muki.on('presenceUpdate', async (old, now) => { //Tipo Presence
  try {
    if (!old) return;
    await Shompi.eventHandlers.Presence.Twitch(old, now);

  } catch (e) {
    console.log(e);
  }
});

//------------------------Guild Update------------------------//
Muki.on('guildUpdate', (oldGuild, newGuild) => {

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
    .setFooter("Dudas, sugerencias o peticiones hablar con ShompiFlen#3338")
  if (!General) return await guild.owner.send(embed);
  else await channel.send(embed);

  database.guildConfigs.set(guild.id, guildConfig);
});

Muki.on('guildDelete', (guild) => {
  database.guildConfigs.delete(guild.id);
  console.log(`El bot ha abandonado la guild ${guild.name}`);
  console.log(`Entrada de configuración:\n${database.guildConfigs.get(guild.id)} (Si es undefined está bien.)`);
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
    await Shompi.NASA.POTD(NASAWebHook).catch(console.error);
    setInterval(async () => {
      await Shompi.NASA.POTD(NASAWebHook).catch(console.error);
    }, 1000 * 60 * 60);
  });
});

Muki.ws.on('RESUMED', (data, shard) => {
  console.log("Websocket Resumed");
  console.log(data);
  console.log(shard);
});

console.log("Logging Muki...");
Muki.login(auth);