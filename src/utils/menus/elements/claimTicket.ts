import { StringSelectMenuOptionBuilder, StringSelectMenuInteraction  } from 'discord.js';
import { menuType } from '@up/main/types';

export const ticketMenuType: menuType = "ticketActionMenu"

function claimTicketOption(): StringSelectMenuOptionBuilder {
    const option = new StringSelectMenuOptionBuilder()
        .setLabel("Claim the ticket")
        .setValue(`claimTicket`)

    return option;
}

export function handler(interaction: StringSelectMenuInteraction) {

}