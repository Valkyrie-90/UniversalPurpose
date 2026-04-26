import { StringSelectMenuOptionBuilder, StringSelectMenuInteraction } from 'discord.js';
import { menuType } from '@up/main/types';

export const ticketMenuType: menuType = "ticketActionMenu"

function deleteTicketOption(): StringSelectMenuOptionBuilder {
    const option = new StringSelectMenuOptionBuilder()
        .setLabel("Delete the ticket")
        .setValue(`deleteTicket`)

    return option;
}

export function handler(interaction: StringSelectMenuInteraction) {

}