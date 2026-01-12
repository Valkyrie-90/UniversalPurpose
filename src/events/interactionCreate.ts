import { Events, MessageFlags } from 'discord.js';
import { parseCustomId } from '../utils/helpers/customIdHelper';
import type { Client, Interaction } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        switch (true) {
            case interaction.isChatInputCommand(): {
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

                break;
            }
            case interaction.isButton(): {
                if (!interaction.isButton()) return; // Type guard
                const buttonId = parseCustomId(interaction.customId)[0];
                const button = (interaction.client as Client).buttons?.get(buttonId);
                
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

                break;
            }
            case interaction.isModalSubmit(): {
                if (!interaction.isModalSubmit()) return; // Type guard
                const modalId = parseCustomId(interaction.customId)[0];
                const modal = (interaction.client as Client).modals?.get(modalId);
                
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

                break;
            }
            default:
                console.error('Unhandled interaction type: ', interaction.type);
                return;
        }    
    },
} as const;