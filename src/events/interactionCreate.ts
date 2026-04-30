import { Events, MessageFlags } from 'discord.js';
import { parseCustomId } from '@up/main/utils/helpers/customIdHelper';
import type { Interaction } from 'discord.js';
import type { CustomClient, actionMenuListItemNameType, createMenuListItemNameType, menuType } from "@up/main/types";

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            const command = (interaction.client as any).commands?.get(interaction.commandName);
                
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction, []);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                }
            }
        }
        else if (interaction.isButton()) {
            const buttonId = parseCustomId(interaction.customId)[0];
            const button = (interaction.client as CustomClient).buttons?.get(buttonId);
                
            if (!button) {
                console.error(`No button matching ${buttonId} was found.`);
                return;
            }

            try {
                await button(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this button!', flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this button!', flags: MessageFlags.Ephemeral });
                }
            }
        }
        else if (interaction.isModalSubmit()) {
            const modalId = parseCustomId(interaction.customId)[0];
            const modal = (interaction.client as CustomClient).modals?.get(modalId);
                
            if (!modal) {
                console.error(`No modal matching ${modalId} was found.`);
                return;
            }

            try {
                await modal(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this modal!', flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this modal!', flags: MessageFlags.Ephemeral });
                }
            }
        } 
        else if (interaction.isStringSelectMenu()) {
            const menuId = parseCustomId(interaction.customId)[0] as menuType
            const menus = (interaction.client as CustomClient).menus

            if (!menus) {
                console.error(`No menus found.`) // this should literally be impossible
                return
            }

            try {
                if (menuId === "ticketActionMenu") {
                    const actionId = interaction.values[0] as actionMenuListItemNameType;

                    const handler = menus.ticketActionMenu.get(actionId)
                    if (handler && typeof handler === "function") {
                        await handler(interaction)
                    } else {
                        throw new Error(`handler is not of expected type - error on actionId: ${actionId}`)
                    }
                } else if (menuId === "ticketCreationMenu") {
                    const actionId = interaction.values[0] as createMenuListItemNameType;

                    const handler = menus.ticketCreationMenu.get(actionId)
                    if (handler && typeof handler === "function") {
                        await handler(interaction)
                    } else {
                        throw new Error(`handler is not of expect type - error on actionId: ${actionId}`)
                    }
                } else {
                    throw new Error(`invalid menu id: ${menuId}`)
                }
            } catch (error) {
                console.error(error)
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this menu!', flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this menu!', flags: MessageFlags.Ephemeral });
                }
            }
        }
        else {
            console.error('Unhandled interaction type: ', interaction.type);
            return;
        }    
    },
} as const;