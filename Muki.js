/*-------------------------MODULOS PRINCIPALES------------------------------*/
const Discord = require('discord.js');
const Muki = new Discord.Client({ partials: ['GUILD_MEMBER'] });
const { google } = require('googleapis');
const Keyv = require('keyv');
/*-------------------------Archivos extra------------------------------*/
const auth = require('./Keys/auth').mukiDev;
let dbConfigs = new Keyv('sqlite://./Databases/configs.sqlite');
let MukiConfigs;
const Shompi = require('./Modules/Modules');
const WebHooks = require('./Keys/hookTokens')
const promEmbed = require('./promotions')
/*------------------------------Inicio del BOT------------------------------*/
const MukiOwnerID = '166263335220805634';
const NekosNSFWEndpoints = require('./Modules/NekosLife/endpoints');
let australGamingMemeHook = new Discord.Webhook();
let tablonHook = new Discord.Webhook();
let exiliadosMemeHook = new Discord.Webhook();
let NASAWebHook = new Discord.Webhook();
let mankosMemeHook = new Discord.Webhook();
let owoCooldown = false;
let Bitrate = 48000;
let Volume = 0.30;
console.log("Iniciando bot...");
Muki.login(auth);

/* const ytApi = google.youtube({
  version: 'v3',
  auth: auth.ytApiKey
}); */

/*
*and maybe danbooru.
*/

Muki.on('message', async message => {

  try {
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
    if ((message.channel.id == '622889689472303120' || message.channel.id == '613558711428055050')) {
      if (message.attachments.size <= 0 || message.author.bot) return;
      const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ size: 64 }))
        .setTitle(message.content)
        .setFooter(`Enviado desde: ${message.guild.name}`, `${message.guild.iconURL({ size: 64 })}`)
        .setImage(message.attachments.first().url);

      if (message.channel.id == '622889689472303120') {
        await australGamingMemeHook.send(null, { embeds: [embed], avatarURL: message.guild.iconURL() }).catch(console.error);
        await mankosMemeHook.send(null, { embeds: [embed] }).catch(console.error);
        return;
      }


      if (message.channel.id == '613558711428055050') {
        return await exiliadosMemeHook.send(null,
          {
            embeds: [embed],
            avatarURL: message.guild.iconURL({ size: 256 }),
            username: message.guild.name
          })
      }
    }
    //Comandos de usuario con prefijo:
    if (message.content.startsWith(MukiConfigs.prefix) && !message.author.bot) {


      /*-----------------Test-----------------*/
      /*   if (command == 'test') {
         
        } */

      /*-----------------Guild info-----------------*/
      if (command == 'guildinfo' && message.channel.type !== 'dm') return await Shompi.GuildInfo.Info.GuildInfo(message);
      if (command == 'uinfo' && message.channel.type !== 'dm') return await Shompi.GuildInfo.Info.UserInfo(message);
      if (command == 'rinfo' && message.channel.type !== 'dm') return await Shompi.GuildInfo.RoleInfo(message);

      /*-----------------ANIME FLV-----------------*/
      if (command == 'anime') {
        const endpoint = message.content.split(" ")[1];
        const query = message.content.split(" ").slice(2).join(" ");
        if (endpoint == 'find') {
          return await Shompi.AnimeFLV.Search(message, query);
        }
      }

      /*------------------Vote Command------------------*/

      if (command == 'vote') {
        return await Shompi.Vote(message, content);
      }


      /*------------------MUSIC PLAYER------------------*/
      if (command == 'skip') {
        if (message.guild.me.voice.channel) {
          const Connection = await message.member.voice.channel.join();
          Connection.dispatcher.destroy();
        } else {
          return await message.reply("No estoy en ningun canal de voz.");
        }
      }
      if (command == 'webPlay') {
        const connection = await message.member.voice.channel.join();
        const dispatcher = connection.play(content, { volume: Volume, bitrate: Bitrate });
        dispatcher.on('finish', () => {
          console.log("Ended transmission");
        });
      }
      if (command == 'osuPlay') {
        const basePath = 'C:/Users/shomp/AppData/Local/osu!/Songs/';
        const connection = await message.member.voice.channel.join();
        const dispatcher = connection.play(basePath + content, { volume: Volume, bitrate: Bitrate });
        dispatcher.on('finish', () => {
          console.log("Ended transmission");
        });
      }
      if (command == 'pcPlay') {
        const connection = await message.member.voice.channel.join();
        const dispatcher = connection.play(content, { volume: Volume, bitrate: Bitrate });
        dispatcher.on('finish', () => {
          console.log("Ended transmission");
        });
      }
      if (command == 'volume') {
        if (message.guild.voice && message.guild) {
          const hamtaroNo = message.guild.emojis.find(em => em.name == 'Hamtaro_NO');
          if (content >= 80) return await message.reply(`${hamtaroNo}`);
          const volume = Number(content) / 100;

          message.guild.voice.connection.dispatcher.setVolume(volume);
        }
      }
      if (command === 'join') {
        if (!message.member.voice) return await message.reply("debes estas en un canal de voz para usar este comando.");
        if (!message.member.voice.channel.joinable) return await message.reply("no puedo entrar al canal en el que estás.");
        return await message.member.voice.channel.join();
      }

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
        if (message.channel.type === 'dm') return await Shompi.Boorus.Yandere(message);
        if (!message.channel.nsfw) return await message.reply("No puedes utilizar este comando fuera de canales NSFW.");
        return await Shompi.Boorus.Yandere(message);
      }
      if (command === "kona") { //konachan
        if (message.channel.type === 'dm') return await Shompi.Boorus.Konachan(message);
        if (!message.channel.nsfw) return await message.reply("No puedes utilizar este comando fuera de canales NSFW.");
        return await Shompi.Boorus.Konachan(message);
      }
      if (command === "safe") { //konachan
        if (message.channel.type === 'dm') return await Shompi.Boorus.KonaSafe(message);
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

        return Shompi.Boorus.TagSearch(message, content);
      }
      //----------------------Nekos.life API----------------------//

      if (NekosNSFWEndpoints.includes(command)) {
        if (message.channel.type == 'dm') return await Shompi.Nekos(message, command);
        if (message.channel.nsfw) return await Shompi.Nekos(message, command);
        return await message.reply("hey hey, cuidado!. No puedes utilizar este comando fuera de canales **NSFW**.");
      }

      //--------------------Cambiar region del servidor--------------------//
      if (command == "region") {
        if (message.channel.type === 'dm') return await message.reply("este comando solo puede utilizarse en Guilds.");
        if (message.member.roles.has('539707811450322944') || message.member.roles.has('561794823812808715') || message.guild.ownerID === message.author.id) {
          if (!message.guild.me.hasPermission('MANAGE_GUILD')) return await message.channel.send("Permisos insuficientes, necesito el permiso 'Administrar Servidor' para poder mover de región la Guild.");
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

    if (message.channel.id === '655976427912429568') {
      if (message.content.startsWith('!status')) return await Shompi.Minecraft.queryRequest(message);
      if (message.content.startsWith('!plugins')) return await Shompi.Minecraft.plugins(message);
    }

    /* if (message.channel.id === '635207654234652715') { //Canal Rust-server
      if (message.content.startsWith("-server")) await Shompi.BattleMetrics.Rust.serverInfo(message.channel);
      if (message.content.startsWith("-players")) return await Shompi.BattleMetrics.Rust.Players(message.channel);
      if (message.content.startsWith("-info")) return await Shompi.BattleMetrics.Rust.Details(message.channel);
    } */


    if (message.content.startsWith('smug')) {
      return await Shompi.Nekos(message, 'smug');
    }
    if (message.content.startsWith('cuddle')) {
      return await Shompi.Nekos(message, 'cuddle');
    }

    if (message.content.toLowerCase().includes("owo") && !owoCooldown) {
      await message.channel.send("òwó");
      owoCooldown = true;
      setTimeout(() => {
        owoCooldown = false;
      }, 1000 * 60 * 2, owoCooldown);
    }
    if (message.content.startsWith("-Discord")) {
      return await Shompi.Discord.Status(message.channel);;
    }

    //-----------------------------Bot Owner commands------------------------------//
    if (message.author.id === MukiOwnerID) {
      if (command == 'status') {
        await Muki.user.setStatus(content);
        MukiConfigs.status = content;
        await dbConfigs.set('configs', MukiConfigs);
      }

      if (command == 'updateprom') {
        const channel = Muki.channels.get('650093912580423684');
        const message = await channel.messages.fetch('654198620605775892');
        const embed = message.embeds[0].setTitle('Servidor de Minecraft Exiliados Oficial (OFFLINE)')
        return await message.edit(null, { embed: embed })
      }
      if (command == 'promotion') {
        const channel = message.mentions.channels.first();
        /**
         * @author ShompiFlen
         * @description This is just for hardcoding Embeds and then send them to a channel.
         */
        return await channel.send(promEmbed);
      }
    }


    if (message.content.startsWith('?')) {
      const content = message.content.substring(1).replace(/\s+/g, " ").split(" ");
      const command = content.shift();

      if (command == 'emoji') {
        const emoji = Muki.emojis.find(emoji => emoji.name == content);
        if (!emoji) return await message.channel.send('No encontré un emoji con ese nombre.');
        await message.delete({ timeout: 1000, reason: 'emoji command' })
        return await message.channel.send(`${emoji}`);
      }
    }

    /*------------------------------------ Guild Owner Commands-------------------------------------*/

    if (message.author.id === message.guild.ownerID || message.member.permissions.has('ADMINISTRATOR')) {

      if (command == 'newchannel') {
        if (!message.guild.me.hasPermission('MANAGE_CHANNELS')) return await message.reply(`necesito el permiso **"MANAGE_CHANNELS"** para poder crear un canal.`);
        const info = new Discord.MessageEmbed().setColor('BLUE').setDescription("[requerido] <Opcional>, separador **' | '**\n[Nombre del canal] | [Tipo de canal: voice, text] | <categoria>");
        await message.channel.send('Instrucciones:', { embed: info });
        return await Shompi.AdminCommands.CreateChannel(message, Muki);
      }

      if (command == 'micmute') {
        const target = message.mentions.members.first() || message.guild.member(content[0]);
        const reason = content.splice(1).join(" ");
        await Shompi.AdminCommands.MicMute(message, target, reason);
      }
    }
    //---------------------------------Discord.js----------------------------------//
    if (message.content.startsWith(".docs")) {
      return await Shompi.DiscordJS(message);
    }

  } catch (error) {
    console.log(error);
    const e = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("¡Ha ocurrido un error!")
      .setAuthor("Stacktrace")
      .setTimestamp()
      .setDescription(`\`\`\`js\n${error.toString()} \`\`\` `)

    return await Muki.channels.get("585990511790391309").send(e);
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

Muki.on('debug', info => {
  console.log(info);
})


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
  const channel = Muki.channels.get('645834668947537940');
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
  return await Muki.channels.get("585990511790391309").send(e).catch(console.error);
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
  const General = Guild.channels.find((ch => ch.name == 'general' || ch.name.includes('bot')) && ch.type == 'text');
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


require('repl').start();

Muki.on('ready', async () => {

  MukiConfigs = await dbConfigs.get("configs");
  if (!MukiConfigs) {
    MukiConfigs = {
      prefix: 'muki!',
      status: 'online',
      activityType: 'LISTENING',
      activityName: 'muki!'
    }
    await dbConfigs.set('configs', MukiConfigs);
  }
  MukiConfigs.prefix = 'dev!'
  console.log(`Online en Discord como: ${Muki.user.tag}`);

  try {
    await Muki.user.setPresence({ activity: { name: MukiConfigs.activityName, type: MukiConfigs.activityType }, status: MukiConfigs.status })
    /* console.log("Fetching Hook de Austral Gaming...");
    australGamingMemeHook = await Muki.fetchWebhook(WebHooks.AGMemeHook.id, WebHooks.AGMemeHook.token);
    console.log("Fetching Hook de Tablon de Fotos...");
    tablonHook = await Muki.fetchWebhook(WebHooks.ElCuliao.id);
    console.log("Fetching Hook de NASA...");
    NASAWebHook = await Muki.fetchWebhook(WebHooks.NASAHook.id); */
    //console.log("Fetching Hook de Mankos For The Win...");
    //mankosMemeHook = await Muki.fetchWebhook("");
    console.log(`${Date()}`);
  } catch (error) {
    console.log(error);
    Muki.emit("error", error);
  }

  /*  setImmediate(async () => {
     await Shompi.NASA.POTD(NASAWebHook).catch(console.error);
     setInterval(async () => {
       await Shompi.NASA.POTD(NASAWebHook).catch(console.error);
     }, 1000 * 60 * 60);
   }); */
});

Muki.ws.on('RESUMED', (data, shard) => {
  console.log("Websocket Resumed");
  console.log(data);
  console.log(shard);
})
