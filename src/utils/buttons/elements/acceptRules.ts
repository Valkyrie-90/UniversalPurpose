import { ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember, MessageFlags } from 'discord.js';

function acceptRulesButton(): ButtonBuilder {
    const button = new ButtonBuilder()
        .setCustomId("acceptRules")
        .setLabel("✅ I Accept The Rules!")
        .setStyle(ButtonStyle.Success);

    return button;
}

async function handler(interaction: ButtonInteraction) {
    if (!interaction.member) return
    if (!interaction.guild || interaction.guild.id !== "1480036180320981073") {
        interaction.reply({
            content: "This guild is not setup for this action.",
            flags: MessageFlags.Ephemeral
        })
        return
    }
    if (!interaction.inGuild()) return;

    const visitorRole = interaction.guild?.roles.cache.find(
        (r) => r.id === "1499736138640789544"
    )
    if (!visitorRole) return

    const role = interaction.guild?.roles.cache.find(
        (r) => r.id === "1480038626032357476"
    )
    if (!role) return

    const member = interaction.member as GuildMember
    if (!member) return;

    try {
        if (member.roles.cache.has(role.toString())) {
            member.roles.remove(role)
            member.roles.add(visitorRole)
        } else {
            member.roles.add(role)
            member.roles.remove(visitorRole)
        }

        interaction.reply({
            content: "Successfully accepted the rules!",
            flags: MessageFlags.Ephemeral
        })
    } catch (error) {
        console.error(error)
        return
    }
}

export { acceptRulesButton, handler };