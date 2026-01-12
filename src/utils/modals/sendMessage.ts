import { MessageFlags, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from 'discord.js';
import { createActionRow } from './createActionRow';

function sendMessageModal(userId: string): ModalBuilder {
    const modal = new ModalBuilder()
        .setCustomId(`sendMessage.${userId}`)
        .setTitle('Send Message to User');

    const messageInput = new TextInputBuilder()
        .setCustomId('sendMessage')
        .setLabel('Message content here...')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Type your message here...')
        .setRequired(true)
        .setMaxLength(2000);

    const actionRow = createActionRow([messageInput]);
    modal.addComponents(...actionRow);

    return modal;
}

async function handler(interaction: ModalSubmitInteraction) {
    const userId = interaction.customId.split('.')[1];
    const messageContent = interaction.fields.getTextInputValue('sendMessage');

    try {
        const user = await interaction.client.users.fetch(userId);
        if (!user) {
            await interaction.reply({ content: 'User not found.', flags: MessageFlags.Ephemeral });
            return;
        }

        await user.send(messageContent);
        await interaction.reply({ content: 'Message sent successfully!', flags: MessageFlags.Ephemeral });
    } catch (error) {
        console.error('Error sending message to user:', error);
        await interaction.reply({ content: 'Failed to send message to the user.', flags: MessageFlags.Ephemeral });
    }
}

export { sendMessageModal, handler };