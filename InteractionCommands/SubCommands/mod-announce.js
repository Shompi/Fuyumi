"use strict";
// @ts-check
Object.defineProperty(exports, "__esModule", { value: true });
exports.Announce = void 0;
const discord_js_1 = require("discord.js");
const Announce = async (interaction) => {
    // valid options for this command
    // Required: canal, descripcion
    // Optional: titulo, color, imagen, pie, mencion1, mencion2, mencion3, miniatura
    if (interaction.inCachedGuild()) {
        const options = {
            channel: interaction.options.getChannel('canal', true),
            description: interaction.options.getString('descripcion').replace("\\n", "\n"),
            title: interaction.options.getString('titulo', false),
            color: interaction.options.getString('color', false),
            imageURL: interaction.options.getString('imagen', false),
            thumbnailURL: interaction.options.getString('miniatura', false),
            footer: interaction.options.getString('pie', false),
            mention1: interaction.options.getMentionable('mencion1', false) ?? " ",
            mention2: interaction.options.getMentionable('mencion2', false) ?? " ",
            mention3: interaction.options.getMentionable('mencion3', false) ?? " ",
        };
        if (options.channel.type !== discord_js_1.ChannelType.GuildText)
            return await interaction.reply({ content: 'El canal que has ingresado no es un canal de texto, por favor ejecuta este comando nuevamente y asegúrate de usar un canal de texto.', ephemeral: true });
        if (interaction.guild.members.me?.permissionsIn(options.channel).has("SendMessages")) {
            if (options.description.length >= 1750)
                return await interaction.reply({ content: 'Lo siento, la cantidad de caracteres que has ingresado en la descripción excede el máximo establecido (1500+).', ephemeral: true });
            if (!(/^.*\.(jpg|gif|png|jpeg|webp)$/i.test(options.imageURL ?? "")))
                options.imageURL = null;
            if (!(/^.*\.(jpg|gif|png|jpeg|webp)$/i.test(options.thumbnailURL ?? "")))
                options.thumbnailURL = null;
            const embed = new discord_js_1.EmbedBuilder()
                .setAuthor({
                name: `Anuncio de ${interaction.member.displayName}`,
                iconURL: interaction.member.displayAvatarURL({ size: 64 }) ?? interaction.user.displayAvatarURL({ size: 64 }),
            })
                .setTitle(options.title ?? null)
                .setDescription(options.description)
                // @ts-ignore
                .setColor(options.color ?? "Blue")
                .setFooter(options.footer ? { text: options.footer } : null)
                .setImage(options.imageURL)
                .setThumbnail(options.thumbnailURL);
            // @ts-ignore
            const success = await options.channel.send({ embeds: [embed], content: `${options.mention1} ${options.mention2} ${options.mention3}` }).catch(console.error);
            if (!success)
                return await interaction.reply({ content: 'Ocurrió un error al intentar enviar el anuncio, revisa mis permisos dentro del canal y asegurate de que pueda enviar mensajes.', ephemeral: true });
            return await interaction.reply({ content: 'El anunció fue enviado con éxito.', ephemeral: true });
        }
    }
};
exports.Announce = Announce;
