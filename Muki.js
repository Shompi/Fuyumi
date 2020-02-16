/*----------------------MODULOS PRINCIPALES---------------------------*/
const Discord = require('discord.js');
const Muki = new Discord.Client({ partials: ['GUILD_MEMBER'] });
/*-----------------------Archivos extra----------------------------*/
const auth = require('./Keys/auth').stable;
let MukiConfigs = { status: "ONLINE", activityType: "PLAYING", activityTo: "muki!", prefix: "muki!" };
const Shompi = require('./Modules/Modules');
const WebHooks = require('./Keys/hookTokens')
const promEmbed = require('./promotions')
/*-------------------------Inicio del BOT-------------------------*/
const MukiOwnerID = '166263335220805634';
const NekosNSFWEndpoints = require('./Modules/NekosLife/endpoints');
let australGamingMemeHook = new Discord.Webhook();
let tablonHook = new Discord.Webhook();
let NASAWebHook = new Discord.Webhook();
let owoCooldown = false;


Muki.login(auth);
console.log("Iniciando bot...");


Muki.on('message', async message => {

  try {
    if (!message.guild) return console.log(`${message.author.tag} ha enviado un mensaje através de un DM.`);

    const command = message.content.split(" ")[0].replace(MukiConfigs.prefix, "");
    const content = message.content.split(" ").slice(1).join(" ");

    //Pokecord messages. Mensajes especificos de bots.

    if (message.author.id === '365975655608745985') {
      await message.delete({ timeout: 10000, reason: "pokecord" });
    }
    //Tablon de imagenes-------------------------
    if (message.channel.id == '594461756621848576' && !message.author.bot) {
      if ((message.content.endsWith(".jpeg") || message.content.endsWith(".png") || message.content.endsWith(".jpg") || message.content.endsWith(".gif")) && message.content.startsWith("http")) {
        await Shompi.Tablon(message, tablonHook);
        await message.delete({ timeout: 1000, reason: "Adjuntar imagen" });
        return;
      }
    }

    if (message.author.bot) return;


    // WEBHOOKS Canal de memes de Exiliados, AutralGaming y Mankos for The win

    if (message.channel.id == '622889689472303120') {
      if (message.attachments.size <= 0 || message.author.bot) return;
      const { name, url } = message.attachments.first();
      const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ size: 64 }))
        .setTitle(message.content)
        .setFooter(`Enviado desde: ${message.guild.name}`, `${message.guild.iconURL({ size: 64 })}`)

      if (name.endsWith(".mp4") || name.endsWith(".webm")) embed.attachFiles([url])
      else embed.setImage(url);
      Muki.channels.cache.first(2);
      await australGamingMemeHook.send(null, { embeds: [embed], avatarURL: message.guild.iconURL(), username: message.guild.name }).catch(console.error);
      await CotorrasMemeHook.send(null, { embeds: [embed], avatarURL: message.guild.iconURL(), username: message.guild.name }).catch(console.error);

      return;
    }
    //Comandos de usuario con prefijo:
    if (message.content.startsWith(MukiConfigs.prefix)) {

      /*-----------------Guild info-----------------*/
      if (command == 'guildinfo' && message.channel.type !== 'dm') return await Shompi.GuildInfo.Info.GuildInfo(message);
      if (command == 'uinfo' && message.channel.type !== 'dm') return await Shompi.GuildInfo.Info.UserInfo(message);
      if (command == 'rinfo' && message.channel.type !== 'dm') return await Shompi.GuildInfo.RoleInfo(message);

      /*-----------------ANIME FLV-----------------*/
      if (command == 'anime') return await Shompi.AnimeFLV.Search(message, content);

      /*------------------Vote Command------------------*/
      if (command == 'vote') return await Shompi.Vote(message, content);

      /*------------------MUSIC PLAYER------------------*/
      if (command == 'volume') return await Shompi.Music.Volume(message, content);
      //if (command == 'play') return await Shompi.Music.Play(message, content); breaks the bot
      if (command == 'moan') return await Shompi.Music.Moan(message);

      //--------------------------------OSU API--------------------------------//
      if (command === 'ostats') return await Shompi.Osu.osuProfile(content, message.channel);
      if (command === 'olast') return await Shompi.Osu.osuLastPlay(content, message.channel);
      if (command === 'otop') return await Shompi.Osu.osuTops(content, message.channel);

      //-------------------------------CURRENCIES-------------------------------//
      if (command === 'moneda') return await Shompi.Currencies(message, content);



      //----------------------Enlace de invitacion del bot----------------------//
      if (command === "invite") return await Muki.generateInvite(607177824).then(invite => message.channel.send(invite));

      //----------------------Obtener imagenes desde Boorus----------------------//
      if (command === "dere") { //Yandere
        if (!message.channel.nsfw) return await message.reply("No puedes utilizar este comando fuera de canales NSFW.");
        return await Shompi.Boorus.Yandere(message);
      }
      if (command === "kona") { //konachan
        if (!message.channel.nsfw) return await message.reply("No puedes utilizar este comando fuera de canales NSFW.");
        return await Shompi.Boorus.Konachan(message);
      }
      if (command === "safe") { //konachan
        return await Shompi.Boorus.KonaSafe(message);
      }

      if (command === 'tag') {
        if (!content) {
          const usage = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setDescription('Debes especificar un tag para buscar.')
            .addField('Modo de uso:', '\`muki!tag <tagAqui>\`')
            .addField('Ejemplo:', '\`muki!tag kancolle\`')

          return await message.channel.send(usage);
        }
        return await Shompi.Boorus.TagSearch(message, content);
      }

      //if (command === 'tags') return await Shompi.Tags(message, content);

      //----------------------Nekos.life API----------------------//
      if (NekosNSFWEndpoints.includes(command)) {
        if (message.channel.type == 'dm') return await Shompi.Nekos(message, command);
        if (message.channel.nsfw) return await Shompi.Nekos(message, command);
        return await message.reply("hey hey, cuidado!. No puedes utilizar este comando fuera de canales **NSFW**.");
      }

      if (command == "region") {
        if (!message.guild) return;
        if (message.member.roles.has('539707811450322944') || message.member.roles.has('561794823812808715') || message.guild.ownerID === message.author.id) {
          if (!message.guild.me.hasPermission('MANAGE_GUILD')) return await message.channel.send("Necesito el permiso 'Administrar Servidor' para poder mover de región la Guild.");
          return await Shompi.ChangeRegion(message);
        } else return await message.reply("lo siento, no tienes permiso para utilizar este comando.");
      }

      if (command == "myAvatar") {
        const embed = new Discord.MessageEmbed().setImage(message.author.displayAvatarURL({ size: 1024 })).setColor('BLUE');
        return await message.channel.send(embed);
      }

      if (command == "avatarID") {
        if (!content) return message.reply("debes escribirme la id de algún usuario.");
        let userId = content;
        //console.log("User id: " + userId);
        const User = await Muki.users.fetch(userId, true);
        const embed = new Discord.MessageEmbed().setImage(User.displayAvatarURL({ size: 1024 })).setColor('BLUE').setFooter(`Avatar de ${User.tag}`);
        return await message.reply(embed);
      }
    }

    /*--------------------------COMANDOS SIN PREFIJO----------------------------*/
    if (message.channel.id === '543047520130170910') { //Canal de osu
      const args = message.content.split(" ").slice(1).join(" ");
      if (message.content.startsWith("last")) return await Shompi.Osu.osuLastPlay(args, message.channel);
      if (message.content.startsWith("stats")) return await Shompi.Osu.osuProfile(args, message.channel);
      if (message.content.startsWith("top")) return await Shompi.Osu.osuTops(args, message.channel);
    }

    if (message.content.startsWith('smug')) return await Shompi.Nekos(message, 'smug');
    if (message.content.startsWith('cuddle')) return await Shompi.Nekos(message, 'cuddle');

    if (message.content.toLowerCase().includes("owo") && !owoCooldown) {
      await message.channel.send("òwó");
      owoCooldown = true;
      setTimeout(() => {
        owoCooldown = false;
      }, 1000 * 60 * 2, owoCooldown);
    }
    if (message.content.startsWith("-Discord")) return await Shompi.Discord.Status(message.channel);

    //-----------------------------Bot Owner commands------------------------------//
    if (message.author.id === MukiOwnerID && message.content[0] === '*') {
      const command = message.content.split(" ").slice(1)[0];
      const content = message.content.split(" ").slice(2).join(" ");
      if (command == 'status') {
        await Muki.user.setStatus(content);
        MukiConfigs.status = content;
        await dbConfigs.set('configs', MukiConfigs);
      }

      if (command == 'updateprom') {
        //args: []
        const args = content.split(" ").splice(1);
        const channel = message.mentions.channels.first();
        const prom = await channel.messages.fetch(args[0]);
        const embed = prom.embeds[0].setTitle('test');
        return await message.edit(null, { embed: embed }).catch(err => message.channel.send('No puedo editar un mensaje que no es mio!'));
      }

      if (command == 'promotion') {
        const channel = message.mentions.channels.first();
        return await channel.send(promEmbed);
      }

      if (command == 'totalGuilds') {
        const guilds = new Discord.MessageEmbed()
          .setDescription(`\`\`\`\n${Muki.guilds.map(g => g.name).join(", ")}\`\`\``)
          .setColor('BLUE');
        return await message.channel.send(`Estoy en ${Muki.guilds.size} Guilds!.`, { embed: guilds });
      }

      if (command == 'presence') {
        const user = message.mentions.users.first();
        console.log(user.presence.activities);
        console.log(user.presence.activities.forEach(activity => console.log(activity.name + ' ' + activity.type)));
      }
    }


    if (message.content.startsWith('?')) {
      const content = message.content.substring(1).replace(/\s+/g, " ").split(" ");
      const command = content.shift();

      if (command == 'emoji') {
        const emoji = Muki.emojis.cache.find(emoji => emoji.name == content);
        if (!emoji) return await message.channel.send('No encontré un emoji con ese nombre.');
        await message.delete({ timeout: 1000, reason: 'emoji command' })
        return await message.channel.send(`${emoji}`);
      }
    }

    //---------------------------------Discord.js----------------------------------//
    if (message.content.startsWith(".docs")) return await Shompi.DiscordJS(message);
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

//------------------------------Fin message event------------------------------//

//------------------------Muki listener on GuildMemberRemove ------------------------//
Muki.on('guildMemberRemove', async (GuildMember) => {
  await Shompi.eventHandlers.Guild.MemberRemove(GuildMember, Muki);

});
//------------------------Muki listener on GuildMemberAdd ------------------------//

Muki.on('guildMemberAdd', async GuildMember => {
  await Shompi.eventHandlers.Guild.MemberAdd(GuildMember, Muki);

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

Muki.on('guildBanAdd', async (Guild, User) => {
  const channel = Muki.channels.cache.get('645834668947537940');
  if (!channel) return;
  const embed = new Discord.MessageEmbed()
    .setTitle("UUUUFF")
    .setColor('RED')
    .setDescription(`El miembro ${User.tag} ha sido baneado de ${Guild.name}`)
    .setThumbnail(User.displayAvatarURL({ size: 256 }))
    .setTimestamp();
  return await channel.send(embed);
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

Muki.on('guildCreate', async (Guild) => {
  const General = Guild.channels.cache.find((ch => ch.name == 'general' || ch.name.includes('bot')) && ch.type == 'text');
  const embed = new Discord.MessageEmbed()
    .setTitle("¡Hola!, mi prefijo es muki!")
    .setDescription(
      `La mayoria de mis comandos son NSFW y de monas chinas.\n` +
      `**neko:** Para una gatita (NSFW)\n` +
      `**lewd:** (NSFW)\n` +
      '**meow:** Para un tierno gatito (Safe)\n' +
      'Y muchos más como por ejemplo:\n' +
      'ngif, erok, erofeet, les, yuri, feetg, eroyuri, kuni, tits, pussy.\n' +
      'moneda [codigo] [cantidad], muki!moneda USD 100\n' +
      'dere <tag>\n' +
      '-Discord para ver si hay algun problema con Discord en si.'
    )
    .setColor("BLUE")
    .setFooter("Dudas, sugerencias o peticiones hablar con ShompiFlen#3338")
  if (!General) {
    return await Guild.owner.send("Hola!, mi prefijo es: **muki!**, la mayoria de mis comandos son NSFW.", { embed: embed })
  }
  return await General.send(embed)
})

Muki.on('ready', async () => {
  console.log(`Online en Discord como: ${Muki.user.tag}`);

  try {
    console.log("Fetching Hook de Austral Gaming...");
    australGamingMemeHook = await Muki.fetchWebhook(WebHooks.AGMemeHook.id, WebHooks.AGMemeHook.token);
    //console.log("Fetching Hook de Tablon de Fotos...");
    //tablonHook = await Muki.fetchWebhook(WebHooks.ElCuliao.id, WebHooks.ElCuliao.token);
    console.log("Fetching Hook de NASA...");
    NASAWebHook = await Muki.fetchWebhook(WebHooks.NASAHook.id);
    console.log("Fetching Hook de Cotorras Gaming...");
    CotorrasMemeHook = await Muki.fetchWebhook(WebHooks.CotorrasMemeHook.id, WebHooks.CotorrasMemeHook.token);

    await Muki.user.setPresence({
      activity: {
        name: `${Muki.users.cache.size} users!`,
        type: "LISTENING"
      },
      status: "online"
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
