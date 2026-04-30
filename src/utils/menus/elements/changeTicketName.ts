import { StringSelectMenuOptionBuilder, StringSelectMenuInteraction } from 'discord.js';
import { menuType } from '@up/main/types';

export const ticketMenuType: menuType = "ticketActionMenu"

function changeTicketNameOption(): StringSelectMenuOptionBuilder {
    const option = new StringSelectMenuOptionBuilder()
        .setLabel("Change the ticket's name")
        .setValue(`changeTicketName`)

    return option;
}

export function handler(interaction: StringSelectMenuInteraction) {

}