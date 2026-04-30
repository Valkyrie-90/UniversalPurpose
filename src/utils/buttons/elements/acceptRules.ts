import { ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember, MessageFlags } from 'discord.js';

function acceptRulesButton(): ButtonBuilder {
    const button = new ButtonBuilder()
        .setCustomId("acceptRules")
        .setLabel("I accept the rules!")
        .setStyle(ButtonStyle.Primary);

    return button;
}

async function handler(interaction: ButtonInteraction) {
    if (!interaction.member) throw new Error("member does not exist in acceptRules button")
    if (!interaction.guild || interaction.guild.id !== "1480036180320981073") {
        interaction.reply({
            content: "Internal Server Failure.",
            flags: MessageFlags.Ephemeral
        })
    }
    if (!interaction.inGuild()) return;

    const role = interaction.guild?.roles.cache.find(
        (r) => r.name === "TSRP | Member"
    )
    if (!role) throw new Error("can't find role in acceptRules handler")

    const member = interaction.member
    
    if (!member || !('roles' in member)) return;

    try {
        (member as GuildMember).roles.add(role)

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