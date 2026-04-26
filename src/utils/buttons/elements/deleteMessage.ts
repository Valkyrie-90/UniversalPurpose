import { ButtonBuilder, ButtonInteraction, ButtonStyle, MessageFlags } from 'discord.js';

function deleteMessageButton(messageId: string, channelId: string): ButtonBuilder {
    const button = new ButtonBuilder()
        .setCustomId(`deleteMessage.${messageId}.${channelId}`)
        .setLabel('Delete Message')
        .setStyle(ButtonStyle.Danger);

    return button;
}

async function handler(interaction: ButtonInteraction) {
    const messageId = interaction.customId.split('.')[1];
    const channelId = interaction.customId.split('.')[2];

    try {
        const channel = await interaction.guild?.channels.fetch(channelId);

        if (!channel || !('isTextBased' in channel && channel.isTextBased())) {
            await interaction.reply({ content: 'Channel not found or is not text-based.', flags: MessageFlags.Ephemeral });
            return;
        }
        
        const message = await channel.messages.fetch(messageId);
        if (!message) {
            await interaction.reply({ content: 'Message not found.', flags: MessageFlags.Ephemeral });
            return;
        }

        await message.delete();
        await interaction.reply({ content: 'Message deleted successfully.', flags: MessageFlags.Ephemeral });
    } catch (error) {
        console.error('Error deleting message:', error);
        await interaction.reply({ content: 'Failed to delete the message.', flags: MessageFlags.Ephemeral });
    }
}

export { deleteMessageButton, handler };