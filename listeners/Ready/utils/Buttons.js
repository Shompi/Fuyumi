const MukiClient = require("../../../Classes/MukiClient");
const { TextChannel, MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');

/**@param {MukiClient} client */
module.exports = async (client) => {

  /**@type {TextChannel} */
  const RolesChannel = client.channels.cache.get("865360481940930560");

  // Roles de Juegos
  const AmongusButton = new MessageButton()
    .setCustomId('role-750237826443903077')
    .setStyle('SUCCESS')
    .setLabel('Amongus');

  const ApexLegendsButton = new MessageButton()
    .setCustomId('role-865729353215246357')
    .setStyle('SUCCESS')
    .setLabel('Apex Legends');

  const CSGOButton = new MessageButton()
    .setCustomId('role-699832400510976061')
    .setStyle('SUCCESS')
    .setLabel('Counter-Strike: GO');

  const DayZButton = new MessageButton()
    .setCustomId('role-879217872147185714')
    .setStyle('SUCCESS')
    .setLabel("Day Z");

  const EscapeFromTarkovButton = new MessageButton()
    .setCustomId('role-676967872807043072')
    .setStyle('SUCCESS')
    .setLabel('Escape from Tarkov');
  //**

  const FortniteButton = new MessageButton()
    .setCustomId('role-627237678248886292')
    .setStyle('PRIMARY')
    .setLabel('Fortnite');

  const GenshinImpactButton = new MessageButton()
    .setCustomId('role-810412477116448769')
    .setStyle('PRIMARY')
    .setLabel('Genshin Impact');

  const GTAVButton = new MessageButton()
    .setCustomId('role-867227218422005781')
    .setStyle('PRIMARY')
    .setLabel('GTA V');

  const LeagueButton = new MessageButton()
    .setCustomId('role-865393189628149760')
    .setStyle('PRIMARY')
    .setLabel('League of Legends');

  const MinecraftButton = new MessageButton()
    .setCustomId('role-865394122897227797')
    .setStyle('PRIMARY')
    .setLabel('Minecraft');
  //**

  const RocketLeagueButton = new MessageButton()
    .setCustomId('role-585905903912615949')
    .setStyle('SUCCESS')
    .setLabel('Rocket League');

  const RustButton = new MessageButton()
    .setCustomId('role-639634253369442324')
    .setStyle('SUCCESS')
    .setLabel('Rust');

  const ScumButton = new MessageButton()
    .setCustomId('role-879217852337520640')
    .setStyle('SUCCESS')
    .setLabel('SCUM');

  const SeaOfThievesButton = new MessageButton()
    .setCustomId('role-854968345974669313')
    .setStyle('SUCCESS')
    .setLabel('Sea of Thieves');

  const ValorantButton = new MessageButton()
    .setCustomId('role-707341893544968324')
    .setStyle('SUCCESS')
    .setLabel('Valorant');

  const WarzoneButton = new MessageButton()
    .setCustomId('role-700166161295474728')
    .setStyle('PRIMARY')
    .setLabel('COD: Warzone');

  const WarThunderButton = new MessageButton()
    .setCustomId('role-865423770264928296')
    .setStyle('PRIMARY')
    .setLabel('War Thunder');

  const row1 = new MessageActionRow()
    .addComponents([
      AmongusButton,
      ApexLegendsButton,
      CSGOButton,
      DayZButton,
      EscapeFromTarkovButton,
    ]);

  const row2 = new MessageActionRow()
    .addComponents([
      FortniteButton,
      GenshinImpactButton,
      GTAVButton,
      LeagueButton,
      MinecraftButton,
    ]);

  const row3 = new MessageActionRow()
    .addComponents([
      RocketLeagueButton,
      RustButton,
      ScumButton,
      SeaOfThievesButton,
      ValorantButton,
    ]);

  const row4 = new MessageActionRow()
    .addComponents([
      WarzoneButton,
      WarThunderButton,
    ])

  const JuegosEmbed = new MessageEmbed()
    .setColor('BLUE')
    .setTitle('Roles de Juegos');

  await RolesChannel.messages.fetch('865370324044742656')
    .then(message => {
      message.edit({
        components: [row1, row2, row3, row4],
        embeds: [JuegosEmbed],
      })
    });



  // Roles NSFW
  const AdultButton = new MessageButton()
    .setLabel('Mayor de 18')
    .setStyle('DANGER')
    .setCustomId('role-544718986806296594');

  const ApostadorButton = new MessageButton()
    .setLabel('Apostador Compulsivo')
    .setStyle('DANGER')
    .setCustomId('role-745385918546051222');

  const DegeneradoButton = new MessageButton()
    .setLabel('Degenerado')
    .setStyle('DANGER')
    .setCustomId('role-866061257923493918')

  const AdultRow1 = new MessageActionRow()
    .addComponents([
      AdultButton,
      ApostadorButton,
      DegeneradoButton,
    ])

  const NSFWRolesEmbed = new MessageEmbed()
    .setTitle('Roles +18')
    .setDescription('Si te quitas el rol **Mayor de 18** automáticamente se te quitarán todos los demás roles de esta categoria.')
    .setColor('RED');

  await RolesChannel.messages.fetch("866060332594233365").then(message => {
    message.edit({
      embeds: [NSFWRolesEmbed],
      components: [AdultRow1],
    });
  });


  // Roles Misceláneos

  const EstudianteButton = new MessageButton()
    .setCustomId('role-576195996728426526')
    .setStyle('PRIMARY')
    .setLabel('Estudiante');

  const JovenProgramadorButton = new MessageButton()
    .setCustomId('role-690009340681388115')
    .setStyle('PRIMARY')
    .setLabel('Programador');

  const SimpButton = new MessageButton()
    .setCustomId('role-752006971527266374')
    .setStyle('PRIMARY')
    .setLabel('SIMP');

  const WeebButton = new MessageButton()
    .setCustomId('role-644251281204183070')
    .setStyle('PRIMARY')
    .setLabel('Weeb / Otaku');

  const MiscEmbed = new MessageEmbed()
    .setTitle('Roles Misceláneos')
    .setDescription('No todos los roles te darán acceso a un canal nuevo, algunos son solamente para el look.')
    .setColor('YELLOW');

  const MiscRow1 = new MessageActionRow()
    .addComponents([
      EstudianteButton,
      JovenProgramadorButton,
      SimpButton,
      WeebButton,
    ]);

  await RolesChannel.messages.fetch('866071653128732682').then(message => {
    message.edit({
      embeds: [MiscEmbed],
      components: [MiscRow1],
    });
  });

  // Streamer panel
  const StreamerEmbed = new MessageEmbed()
    .setTitle('Streamer Role')
    .setColor('PURPLE')
    .setDescription('¿Eres Streamer?, ¿Quieres que tus transmisiones aparezcan en el canal <#600159867239661578>?\nEntonces asignate este rol!');


  const StreamerButton = new MessageButton()
    .setCustomId('role-912096189443350548')
    .setLabel('Streamer')
    .setStyle('PRIMARY')

  const StreamerRow1 = new MessageActionRow()
    .addComponents([
      StreamerButton
    ]);

  await RolesChannel.messages.fetch("912096885882363994").then(message => {
    message.edit({
      embeds: [StreamerEmbed],
      components: [StreamerRow1]
    })
  });

  console.log("Los botones han sido cargados / actualizados!");
  return true;
}