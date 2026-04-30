function parseCustomId(customId: string): string[] {
    return customId.split('.');
}

function timeoutUserId(customId: string): string | null {
    const parts = parseCustomId(customId);
    return parts.length > 1 ? parts[1] : null;
}

function deleteMessageId(customId: string): string | null {
    const parts = parseCustomId(customId);
    return parts.length > 1 ? parts[1] : null;
}

function sendMessageUserId(customId: string): string | null {
    const parts = parseCustomId(customId);
    return parts.length > 1 ? parts[1] : null;
}

/**
 * @param customId either `ticketCreationMenu` or `ticketActionMenu`
 * 
 * 
 * @returns either `["ticketCreationMenu", "channelId"]` or `["ticketActionMenu", "ownerId", "userId", "channelId"]`
 */
function getTicketIds(customId: string): string[] | null {
    const parts = parseCustomId(customId);
    return parts.length > 1 ? parts : null;
}

export { parseCustomId, timeoutUserId, deleteMessageId, sendMessageUserId };