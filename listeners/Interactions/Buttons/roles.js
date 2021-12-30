const { ButtonInteraction } = require("discord.js");


const NSFWROLES = ["745385918546051222", "866061257923493918"];

const Mayor18Id = '544718986806296594';
/**
@param {ButtonInteraction} interaction
 */
module.exports = async (interaction) => {
  // Enviemos un mensaje por ahora

  const { guild, member } = interaction;
  const ButtonPressed = interaction.component;

  // customId llega como role-123456789l0
  const RoleId = ButtonPressed.customId.slice(5);
  const RoleObject = guild.roles.cache.get(RoleId);
  const MemberIsOver18 = member.roles.cache.has(Mayor18Id);

  let operation;

  console.log(`${interaction.member.user.tag} presionó ${ButtonPressed.label}`);

  if (!RoleObject) return;

  if (NSFWROLES.includes(RoleId) && !MemberIsOver18)
    return interaction.reply({
      content: 'Debes tener el rol **Mayor de 18** para poder asignarte este rol.',
      ephemeral: true,
    });


  if (MemberIsOver18 && RoleId === Mayor18Id) {
    await member.roles.remove([...NSFWROLES, Mayor18Id]);

    return interaction.reply({
      content: '**Se te han quitado todos los roles NSFW / +18**',
      ephemeral: true,
    });
  }


  if (member.roles.cache.has(RoleId)) {
    operation = await member.roles.remove(RoleId).then(() => false);
  }
  else {
    operation = await member.roles.add(RoleId).then(() => true);
  }

  return await interaction.reply({
    content: `Se te ${operation ? 'agregó' : 'quitó'} el rol **${RoleObject.name}**`,
    ephemeral: true,
  });
}