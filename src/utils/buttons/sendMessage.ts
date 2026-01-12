import { ButtonBuilder, ButtonInteraction, ButtonStyle, Interaction } from 'discord.js';
import { sendMessageUserId } from '../helpers/customIdHelper';
import { sendMessageModal } from '../modals/';

function sendMessageButton(userId: string): ButtonBuilder {
    const button = new ButtonBuilder()
        .setCustomId(`sendMessage.${userId}`)
        .setLabel('Send Message to User')
        .setStyle(ButtonStyle.Primary);

    return button;
}

async function handler(interaction: ButtonInteraction) {
    const userId = sendMessageUserId(interaction.customId);
    if (!userId) {
        console.error('No user ID found in customId.');
        return;
    }

    interaction.showModal(sendMessageModal(userId));
}

export { sendMessageButton, handler };