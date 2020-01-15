import { MessageEmbed } from "discord.js";

const promEmbed = new Discord.MessageEmbed()
            .setTitle(`Servidor de Minecraft Exiliados Oficial\nVanilla`)
            .setDescription("**IP:** 190.215.80.215:25565\n**Hosteado en:** Chile (Servidor Local)\n**Modo:** Survival\n**Reglas:**\nNo grifiar otras casas\nNo robar sin necesidad\nNo matar las mascotas de otros\nPvP solo con concentimiento de ambas partes.\n\n")
            .addField("Administrador:", "<@196140725274935299>")
            .addField("Slots:", "20")
            .setColor("BLUE")
            .setThumbnail("https://gamehag.com//img/rewards/logo/minecraft.png");

export {promEmbed};