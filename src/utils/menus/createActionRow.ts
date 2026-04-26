import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

function createActionRow(menu: StringSelectMenuBuilder) {
    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(menu);
    return row;
}

export { createActionRow }