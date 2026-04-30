import { Events, GuildMember, EmbedBuilder } from 'discord.js';
import { readServerConfig } from '@up/main/utils/jsonhelpers/readServerConfig';

function GuildMemberJoinEmbed(member: GuildMember) {
    const welcomeEmbed = new EmbedBuilder()
        .setTitle(`${member.displayName} has landed!`)
        .setDescription(`Welcome to ${member.guild.name}, please check out the ${member.guild.rulesChannel ? `[rules](${member.guild.rulesChannel.url})` : "rules"} and say hello in the general chat!`)
        .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL() ?? undefined })
        .setColor(0x2EFF3F)
        .setFooter({ text: `Service provided by ${member.client.user.displayName}` })
        .setTimestamp();
    
    return welcomeEmbed;
}

export default {
    name: Events.GuildMemberAdd,
    async execute(member: GuildMember) {
        if (member.guild.id !== "1480036180320981073") return

        const guildName = member.guild.name;

        const serverConfig = readServerConfig(member.guild.id)
        if (!serverConfig) throw new Error(`server config for guild: ${guildName} is null`)
        const welcomeChannel = member.guild.channels.cache.find(
            (ch) => ch.id === serverConfig.welcomeChannelID
        )

        if (!welcomeChannel || !welcomeChannel.isTextBased() || !welcomeChannel.isSendable()) return;

        const embed = GuildMemberJoinEmbed(member)

        welcomeChannel.send({
            content: `<@${member.id}>`,
            embeds: [embed]
        });
    },
};
