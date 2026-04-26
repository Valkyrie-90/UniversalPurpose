import { StringSelectMenuOptionBuilder, StringSelectMenuInteraction  } from 'discord.js';
import { menuType } from '@up/main/types';

export const ticketMenuType: menuType = "ticketCreationMenu"

export function createTicketOption(name?: string): StringSelectMenuOptionBuilder {
    const option = new StringSelectMenuOptionBuilder()
        .setLabel(name ? `Create a ${name} Ticket` : "Create a Ticket")
        .setValue("createTicket")

    return option;
}

export function handler(interaction: StringSelectMenuInteraction) {
    
}