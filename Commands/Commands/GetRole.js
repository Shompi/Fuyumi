//@ts-check
'use strict'
const { MessageEmbed, Message, Role, Collection } = require('discord.js');
const { basename } = require('path');


/**@param {Role} role */
const roleRemove = (role) =>
  new MessageEmbed()
    .setTitle(`Te he quitado el rol ${role.name} exitósamente!`)
    .setDescription("Para volver a tener este rol, ejecuta el comando nuevamente.")
    .setColor("GREEN");

/**@param {Role} role */
const roleAdd = (role) =>
  new MessageEmbed()
    .setTitle(`Te he añadido el rol ${role.name} exitósamente!`)
    .setDescription("Para quitarte éste rol ejecuta el comando nuevamente.")
    .setColor("GREEN");

const noPermissions =
  new MessageEmbed()
    .setTitle("No tengo los permisos suficientes!")
    .setDescription("¡Necesito el permiso \`MANAGE_ROLES\` en **mi Rol más alto** para poder añadir roles!\n\nO ¿Intentaste añadirte un rol mas alto que el mio?\n**¡No puedo hacer eso!**")
    .setColor("RED");

/**@param {Collection<string, Role>} roles */
const autoRoleList = (roles) => {
  const description = roles.map(r => `**${r.name}** (ID: ${r.id})`).join("\n");

  return new MessageEmbed()
    .setDescription(description)
    .setColor("BLUE");
}

module.exports = {
  name: "getrole",
  filename: basename(__filename),
  aliases: [],
  description: "Te asigna / quita el rol que especifiques.\nSi eres administrador, puedes escribir **<prefijo>getrole -add | -rem idDelRol1, idDelRol2** para añadir o quitar roles autoasignables.",
  usage: "getrole nombre del rol 1, ..., nombre del rol n",
  nsfw: false,
  enabled: true,
  guildOnly: true,
  permissions: [],
  flags: ['-add', '-rem', '-show'],
  cooldown: 3,
  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  execute(message, args) {
    const { client, guild } = message;

    if (args.length === 0)
      return ShowRoles(message);

    // Si el usuario invocando el comando es administrador o dueño de la Guild:
    if (message.member.hasPermission("ADMINISTRATOR", { checkOwner: true }) && this.flags.includes(args[0])) {
      ExecuteAdminCommand(message, args);
    } else {
      ExecuteCommandNormally(message, args);
    }
  }
}

// Funciones:

/**
 * @param {Message} message
 * @param {String[]} args
 */
const ExecuteAdminCommand = (message, args) => {

  // Recursos fundamentales: Roles
  const { client, guild } = message;

  /** Roles que son parte de la Guild. */
  const GuildRoles = guild.roles.cache;

  /**
  * Lista de roles guardados en la base de datos.
  * @type {Array}
  */
  const GuildAutoRoles = client.db.guildAutoRoles.get(guild.id).map(role => role.id) || [];


  // Funciones:

  /** @param {String[]} args */
  const AddRoleToDB = (args) => {
    // Verificar que el o los roles existan en la Guild
    const noExisten = [];
    const Existen = [];

    for (const roleID of args) {
      const RoleInGuild = GuildRoles.get(roleID);
      // Si roleID no existe como ID de un rol en la Guild
      if (!RoleInGuild)
        noExisten.push(roleID);

      else {
        // Si roleID EXISTE como ID válida de un rol en la Guild

        if (GuildAutoRoles.find(autorole => autorole.id === roleID)) continue; // Por que si ya está en la base de datos, no es necesario volver a colocarlo. 

        Existen.push(GuildRoles.get(roleID).name);
        GuildAutoRoles.push({ name: RoleInGuild.name, id: RoleInGuild.id });
      }
    }

    // Guardamos en la base de datos nuevamente
    client.db.guildAutoRoles.set(guild.id, GuildAutoRoles);

    return Existen;
  }

  /** @param {String[]} args */
  const RemRoleFromDB = (args) => {
    let newRoles = GuildAutoRoles;
    const RoleNames = [];

    for (const roleID of args) {
      newRoles = newRoles.filter(roleid => roleid !== roleID);
    }

    // Guardamos en la base de datos los nuevos roles
    client.db.guildAutoRoles.set(guild.id, newRoles);

    for (const roleID of newRoles) {

      if (!GuildAutoRoles.find(autorole => autorole.id === roleID)) {
        RoleNames.push(GuildRoles.get(roleID).name);
      }
    }

    return RoleNames;
  }

  // Verificar el tipo de operacion que va a realizar el Administrador [-add o -rem]
  const OP = args.shift(); // -add o -rem

  if (OP == '-add') {
    const AddedRoleNames = AddRoleToDB(args);

    message.channel.send(`Se agregaron los siguientes roles: **${AddedRoleNames.join(", ")}**`);
  }
  else {
    const RemovedRoleNames = RemRoleFromDB(args);

    message.channel.send(`Se quitaron los siguientes roles: **${RemovedRoleNames.join(", ")}**`);
  }
}


/**
 * @param {Message} message 
 * @param {String[]} args 
 */
const ExecuteCommandNormally = (message, args) => {

  // Preparamos los argumentos, en este caso nombre de roles, separados por coma
  const argumentos = args.join(" ").split(/,\s+/g);

  // Se busca el rol POR NOMBRE y se le asigna al miembro.
  const { guild, client, member } = message;

  const GuildRoles = guild.roles.cache;

  /** Arreglo de objetos {name:, id:} */
  const GuildAutoRoles = client.db.guildAutoRoles.get(guild.id).map(role => role.id) || [];

  const toAdd = [], notAdded = [], toAddNames = [];

  for (const rolename of argumentos) {
    const RoleInGuild = GuildRoles.find(role => role.name.toLowerCase() === rolename.toLowerCase());

    if (RoleInGuild && GuildAutoRoles.includes(RoleInGuild.id)) {
      toAdd.push(RoleInGuild.id);
      toAddNames.push(RoleInGuild.name);
    }
    else notAdded.push(rolename);
  }

  member.roles.add(toAdd).then(member => {
    message.channel.send(`Se te añadieron **${toAdd.length}** roles: **${toAddNames.join(", ")}**\nNo se te añadió: **${notAdded.join(", ")}**`);
  }).catch(err => {
    message.channel.send("Ocurrió un error al intentar añadirte los roles, verifica que yo tenga lo permisos adecuados y que mi rol sea más alto que los roles que estoy intentando dar.");
  });
}

/** @param {Message} message */
const ShowRoles = (message) => {
  const { client, guild } = message;

/** Arreglo de objetos {name: string id: string}*/
  const GuildAutoRoles = client.db.guildAutoRoles.get(guild.id) || [];
  console.log(GuildAutoRoles);

  const embed = new MessageEmbed()
    .setTitle("Roles que te puedes autoasignar:")
    .setDescription(`\`\`\`\n${GuildAutoRoles.map(role => `${role.name} (${role.id})`).join("\n")}\`\`\``)
    .setColor("BLUE")
    .setThumbnail(guild.iconURL({ size: 512 }));

  message.channel.send(embed);
}