/*----------------------MODULOS PRINCIPALES---------------------------*/
const { MessageEmbed, Webhook, Collection } = require('discord.js');
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

/*-----------------------Archivos extra----------------------------*/
const WebHooks = require('./Keys/hookTokens');
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

const onCooldown = (author, timeleft) =>
  new MessageEmbed()
    .setTitle(`⏳ ¡Aún no puedes usar este comando!`)
    .setDescription(`${author}, ¡debes esperar ${timeleft.toFixed(1)} para volver a utilizar este comando!`)

const pokecordFilter = async (message) => {
  const { author, guild, channel } = message;
  if (author.id === '365975655608745985' && guild.id === "537484725896478733" && channel.id !== '585990511790391309') {
    message.delete({ timeout: 10000, reason: "Pokecord" });
  }

  return undefined;
}

Muki.on('message', async (message) => {
  try {
    if (message.partial)
      message = await message.fetch();

    const { author, guild, channel, mentions } = message;

    //if (!guild) return console.log(`${author.tag} ha enviado un mensaje através de un DM.`);
    pokecordFilter(message).catch(console.error);
    if (author.bot) return;

    //Webhooks
    if (channel.id == '622889689472303120') {
      if (message.attachments.size <= 0 || author.bot) return;
      const { attachments } = message;
      const embeds = [];
      const files = [];
      for (const attachment of attachments.values()) {

        const { url, name } = attachment;
        const embed = new MessageEmbed()
          .setColor("BLUE")
          .setAuthor(`${author.tag}`, author.displayAvatarURL({ size: 64 }))
          .setFooter(`Enviado desde: ${guild.name}`, `${guild.iconURL({ size: 64 })}`);

        if (name.endsWith(".mp4") || name.endsWith(".webm"))
          files.push(attachment);
        else embed.setImage(url);

        embeds.push(embed);
      }
      embeds[0].setTitle(message.content);
      await australGamingMemeHook.send(null, { embeds: embeds, avatarURL: guild.iconURL(), username: guild.name, files: files });
      return await CotorrasMemeHook.send(null, { embeds: embeds, avatarURL: guild.iconURL(), username: guild.name, files: files });
    }

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

      if (command.name === 'eval' && author.id !== Muki.OWNER)
        return;

      if (!command.enabled)
        return channel.send(cmdNotEnabled(author));

      if (command.nsfw && !channel.nsfw)
        return channel.send(notNSFW);

      if (command.guildOnly && channel.type !== 'text')
        return channel.send("No puedo ejecutar este comando en mensajes privados!");

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

Muki.on('ready', async () => {
  console.log(`Online en Discord como: ${Muki.user.tag}`);

  try {
    console.log("Fetching Hook de Austral Gaming...");
    australGamingMemeHook = await Muki.fetchWebhook(WebHooks.AGMemeHook.id, WebHooks.AGMemeHook.token);
    console.log("Fetching Hook de NASA...");
    NASAWebHook = await Muki.fetchWebhook(WebHooks.NASAHook.id);
    console.log("Fetching Hook de Cotorras Gaming...");
    CotorrasMemeHook = await Muki.fetchWebhook(WebHooks.CotorrasMemeHook.id, WebHooks.CotorrasMemeHook.token);

    await Muki.user.setPresence(Muki.config.presence);

    console.log(`Bot listo: ${Date()}`);

  } catch (error) {
    console.log(error);
    Muki.emit("error", error);
  }

  Muki.setImmediate(() => {
    Muki.NASA(NASAWebHook);
    Muki.setInterval(() => {
      Muki.NASA(NASAWebHook);
    }, 1000 * 60 * 60);
  });
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

Muki.on('guildBanAdd', (guild, user) => {
  if (!guild.systemChannel) return;
  const embed = new MessageEmbed()
    .setAuthor(user.tag, user.displayAvatarURL({ size: 256 }))
    .setDescription(`Ha sido baneado de **${guild.name}**`)
    .setColor('RED')
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .setTimestamp();

  return guild.systemChannel.send(embed);
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
  console.log(`Muki se ha reconectado, numero de eventos en Replayed: ${Replayed}`);
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

  return Muki.channels.cache.get("585990511790391309").send(`Nueva Guild ${guild.name} (${guild.id})!`);
});

Muki.on('guildDelete', (guild) => {
  Muki.db.guildConfigs.delete(guild.id);
  console.log(`El bot ha abandonado la guild ${guild.name}`);
  console.log(`Entrada de configuración:\n${Muki.db.guildConfigs.get(guild.id)} (Si es undefined está bien.)`);
});



Muki.ws.on('RESUMED', (data, shard) => {
  console.log("Websocket Resumed");
  console.log(data);
  console.log(shard);
});

console.log("Logging Muki...");

Muki.login(Muki.config.token);