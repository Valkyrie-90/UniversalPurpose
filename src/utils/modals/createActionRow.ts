import { ActionRowBuilder, TextInputBuilder } from 'discord.js';

function createActionRow(components: any[]) {
    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(components);
    return [row];
}

export { createActionRow };