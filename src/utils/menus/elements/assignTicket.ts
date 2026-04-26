import { StringSelectMenuOptionBuilder, StringSelectMenuInteraction } from 'discord.js';
import { menuType } from '@up/main/types';

export const ticketMenuType: menuType = "ticketActionMenu"

export function assignTicketOption(): StringSelectMenuOptionBuilder {
    const option = new StringSelectMenuOptionBuilder()
        .setLabel("Assign the ticket")
        .setValue(`assignTicket`)

    return option;
}

export function handler(interaction: StringSelectMenuInteraction) {

}