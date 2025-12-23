import { EmbedBuilder, Interaction, Message } from 'discord.js';

function createNoPermsEmbed(interaction: Interaction): EmbedBuilder {
    const noPermsEmbed = new EmbedBuilder()
        .setTitle('Insufficient Permissions')
        .addFields({ name: 'Error:', value: 'You do not have permission to use this command.', inline: true })
        .addFields({ name: '', value: '', inline: false })
        .setColor(0xff0000)
        .setFooter({ text: `${interaction.client.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();
    
    return noPermsEmbed;
}

function createGlobalBanEmbed(interaction: Interaction, args: string[]) : EmbedBuilder {
    const globalBanEmbed = new EmbedBuilder()
        .setTitle('Global Ban Issued')
        .setDescription(`A global ban has been issued to <@${args[0]}>.`)
        .addFields(
            { name: 'User', value: `<@${args[0]}>`, inline: false },
            { name: 'Reason', value: args[1].length > 1024 ? `${args[1].slice(0, 1021)}...` : args[1], inline: false },
            { name: 'Moderator', value: interaction.user.tag, inline: false },
            { name: 'Origin Server', value: interaction.guild?.name ?? 'Direct Message', inline: false },
        )
        .setColor(0xff0000)
        .setFooter({ text: `Issued by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();
    
    return globalBanEmbed;
}

function createFlaggedMessageEmbed(message: Message, term: string): EmbedBuilder {
    const flaggedMessageEmbed = new EmbedBuilder()
        .setTitle('Flagged Message')
        .setDescription(`UniversalPurpose has detected a user using a flagged term at ${message.url}.`)
        .addFields(
            { name: 'User', value: message.author.tag, inline: false },
            { name: 'Message', value: message.content, inline: false },
            { name: 'Flagged Term', value: term, inline: false },
        )
        .setColor(0xff0000)
        .setFooter({ text: message.client.user.username, iconURL: message.client.user.displayAvatarURL() })
        .setTimestamp();
    
    return flaggedMessageEmbed;
}

export { createNoPermsEmbed, createGlobalBanEmbed, createFlaggedMessageEmbed };