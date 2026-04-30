import { ButtonBuilder, ButtonInteraction, ButtonStyle, MessageFlags } from 'discord.js';

function timeoutUserButton(userId: string): ButtonBuilder {
    const button = new ButtonBuilder()
        .setCustomId(`timeoutUser.${userId}`)
        .setLabel('Timeout User')
        .setStyle(ButtonStyle.Secondary);
        
    return button;
}

async function handler(interaction: ButtonInteraction) {
    const userId = interaction.customId.split('.')[1];

    try {
        const guild = interaction.guild;
        if (!guild) {
            await interaction.reply({ content: 'Guild not found.', flags: MessageFlags.Ephemeral });
            return;
        }

        const member = await guild.members.fetch(userId);
        if (!member) {
            await interaction.reply({ content: 'Member not found.', flags: MessageFlags.Ephemeral });
            return;
        }

        const timeoutDuration = 5 * 60 * 1000; // 5 minutes
        await member.timeout(timeoutDuration, `Timed out by ${interaction.user.tag}`);

        await interaction.reply({ content: `User ${member.user.tag} has been timed out for 5 minutes.`, flags: MessageFlags.Ephemeral });
    } catch (error) {
        console.error('Error timing out user:', error);
        await interaction.reply({ content: 'Failed to timeout the user.', flags: MessageFlags.Ephemeral });
    }
}

export { timeoutUserButton, handler };