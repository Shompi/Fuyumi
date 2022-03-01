const { TextChannel, MessageButton, MessageActionRow, MessageEmbed, Util } = require('discord.js');

/**
 * 
 * @param {Object} param0
 * @param {string} param0.roleId La id del rol al que este botón pertenece
 * @param {import("discord.js").MessageButtonStyleResolvable} param0.style El estilo de este botón
 * @param {string} param0.label La etiqueta de este botón
 */
function createButton({ roleId, style, label }) {
  return new MessageButton()
    .setCustomId(`role-${roleId}`)
    .setStyle(style)
    .setLabel(label);
}

/**@param {import("../../../Classes/Client")} client */
module.exports = async (client) => {

  /**@type {TextChannel} */
  const RolesChannel = client.channels.cache.get("865360481940930560");

  // Roles de Juegos

  /* SUCCESS ROW */
  const AmongusButton = createButton({ style: 'SUCCESS', roleId: "750237826443903077", label: "Amongus" });

  const ApexLegendsButton = createButton({ style: 'SUCCESS', roleId: "865729353215246357", label: "Apex Legends" });

  const CSGOButton = createButton({ style: 'SUCCESS', roleId: "699832400510976061", label: "Counter-Strike: GO" });

  const DayZButton = createButton({ style: 'SUCCESS', roleId: "879217872147185714", label: "Day Z" });

  const EscapeFromTarkovButton = createButton({ style: 'SUCCESS', roleId: "676967872807043072", label: "Escape from Tarkov" });

  /* PRIMARY ROW */

  const FIFAButton = createButton({ style: 'PRIMARY', roleId: "945050513236434945", label: "FIFA" });

  const FortniteButton = createButton({ style: 'PRIMARY', roleId: "627237678248886292", label: "Fortnite" });

  const GenshinImpactButton = createButton({ style: 'PRIMARY', roleId: "810412477116448769", label: "Genshin Impact" });

  const GTAVButton = createButton({ style: 'PRIMARY', roleId: "867227218422005781", label: "GTA V" });

  const LeagueButton = createButton({ style: 'PRIMARY', roleId: "865393189628149760", label: "League of Legends" });

  /* SUCCESS ROW */

  const LostArkButton = createButton({ style: 'SUCCESS', roleId: "945054638263128084", label: "Lost Ark" });

  const MinecraftButton = createButton({ style: 'SUCCESS', roleId: "865394122897227797", label: "Minecraft" });

  const RocketLeagueButton = createButton({ style: 'SUCCESS', roleId: "585905903912615949", label: "Rocket League" });

  const RustButton = createButton({ style: 'SUCCESS', roleId: "639634253369442324", label: "Rust" });

  const ScumButton = createButton({ style: 'SUCCESS', roleId: "879217852337520640", label: "SCUM" });


  /* PRIMARY ROW */
  const SeaOfThievesButton = createButton({ style: 'PRIMARY', roleId: "854968345974669313", label: "Sea of Thieves" });

  const ValorantButton = createButton({ style: 'PRIMARY', roleId: "707341893544968324", label: "Valorant" });

  const WarzoneButton = createButton({ style: 'PRIMARY', roleId: "700166161295474728", label: "COD: Warzone" });

  const WarThunderButton = createButton({ style: 'PRIMARY', roleId: "865423770264928296", label: "War Thunder" });

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
      FIFAButton,
      FortniteButton,
      GenshinImpactButton,
      GTAVButton,
      LeagueButton,
    ]);

  const row3 = new MessageActionRow()
    .addComponents([
      LostArkButton,
      MinecraftButton,
      RocketLeagueButton,
      RustButton,
      ScumButton,
    ]);

  const row4 = new MessageActionRow()
    .addComponents([
      SeaOfThievesButton,
      ValorantButton,
      WarzoneButton,
      WarThunderButton,
    ]);

  const JuegosEmbed = new MessageEmbed()
    .setColor(Util.resolveColor("BLUE"))
    .setTitle('Roles de Juegos')
    .setDescription('¿Quieres el rol de un juego que no está en la lista? ¡Puedes pedirlo en el canal general!');

  await RolesChannel.messages.fetch('865370324044742656')
    .then(message => {
      message.edit({
        components: [row1, row2, row3, row4],
        embeds: [JuegosEmbed],
      });
    });



  // Roles NSFW
  const AdultButton = createButton({ style: 'DANGER', roleId: "544718986806296594", label: "Mayor de 18" });

  const ApostadorButton = createButton({ style: 'DANGER', roleId: "745385918546051222", label: "Apostador Compulsivo" });

  const DegeneradoButton = createButton({ style: 'DANGER', roleId: "866061257923493918", label: "Degenerado" });

  const AdultRow1 = new MessageActionRow()
    .addComponents([
      AdultButton,
      ApostadorButton,
      DegeneradoButton,
    ]);

  const NSFWRolesEmbed = new MessageEmbed()
    .setTitle('Roles +18')
    .setDescription('Si te quitas el rol **Mayor de 18** automáticamente se te quitarán todos los demás roles de esta categoria.')
    .setColor(Util.resolveColor('RED'));

  await RolesChannel.messages.fetch("866060332594233365").then(message => {
    message.edit({
      embeds: [NSFWRolesEmbed],
      components: [AdultRow1],
    });
  });

  // Roles Misceláneos

  const EstudianteButton = createButton({ style: 'PRIMARY', roleId: "576195996728426526", label: "Estudiante" });

  const JovenProgramadorButton = createButton({ style: 'PRIMARY', roleId: "690009340681388115", label: "Programador" });

  const SimpButton = createButton({ style: 'PRIMARY', roleId: "752006971527266374", label: "SIMP" });

  const WeebButton = createButton({ style: 'PRIMARY', roleId: "644251281204183070", label: "Weeb / Otaku" });

  const MiscEmbed = new MessageEmbed()
    .setTitle('Roles Misceláneos')
    .setDescription('No todos los roles te darán acceso a un canal nuevo, algunos son solamente para el look.')
    .setColor(Util.resolveColor('YELLOW'));

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
    .setColor(Util.resolveColor("PURPLE"))
    .setDescription('¿Eres Streamer?, ¿Quieres que tus transmisiones aparezcan en el canal <#600159867239661578>?\nEntonces asignate este rol!');


  const StreamerButton = createButton({ style: 'PRIMARY', roleId: "912096189443350548", label: "Streamer" });

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