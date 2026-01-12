import { ActionRowBuilder, ButtonBuilder } from 'discord.js';

function createActionRow(buttons: ButtonBuilder[]): ActionRowBuilder<ButtonBuilder> {
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(buttons);
    return row;
}

export { createActionRow };