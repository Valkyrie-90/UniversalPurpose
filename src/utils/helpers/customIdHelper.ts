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

export { parseCustomId, timeoutUserId, deleteMessageId, sendMessageUserId };