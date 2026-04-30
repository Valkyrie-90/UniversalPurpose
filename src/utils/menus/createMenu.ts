import { StringSelectMenuBuilder } from "discord.js"

function createTicketCreationMenu(channelId: string): StringSelectMenuBuilder {
    const menu = new StringSelectMenuBuilder()
        .setCustomId(`ticketCreationMenu.${channelId}`)
        .setPlaceholder("Choose a ticket to create!")

    return menu
}

function createTicketActionMenu(channelId: string, ownerId: string, userId: string) {
    const menu = new StringSelectMenuBuilder()
        .setCustomId(`ticketActionMenu.${ownerId}.${userId}.${channelId}`)
        .setPlaceholder("Select an operation!")

    return menu
}

export { createTicketActionMenu, createTicketCreationMenu }