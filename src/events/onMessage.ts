import { Events } from 'discord.js';
import { getReportChannel, getChannelsToFilter } from '../utils/helpers/getChannels';
import { flaggedTerms } from '../bot';
import { createFlaggedMessageEmbed } from '../utils/embeds';
import type { Message } from 'discord.js';
import { deleteMessageButton, sendMessageButton, timeoutUserButton, createActionRow } from '../utils/buttons/';

// Define the event handler for message creation
export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        // ignore bot messages
        if (!message.author) return;

        // Check if the message is in a channel that needs to be filtered
        getChannelsToFilter(message)?.forEach(async (channelId) => {
            // Check the message content against flagged terms
            if (message.channel.id === channelId) {
                message.content.split(' ').forEach(async (word) => {
                    if (flaggedTerms.includes(word.toLowerCase())) {
                        try {
                            const reportChannelId = getReportChannel(message);
                            if (reportChannelId) {
                                const reportChannel = await message.client.channels.fetch(reportChannelId);
                                if (reportChannel?.isSendable()) {
                                    const embeds = [
                                        createFlaggedMessageEmbed(message, word)
                                    ];
                                    const buttons = [
                                        sendMessageButton(message.author.id), 
                                        deleteMessageButton(message.id, message.channel.id), 
                                        timeoutUserButton(message.author.id)
                                    ];
                                    const actionRow = [createActionRow(buttons)];
                                    await reportChannel.send({ embeds: embeds, components: actionRow });
                                }
                            }
                        } catch (error) {
                            console.error(`Failed to delete message: ${error}`);
                        }
                    }
                });
            }
        });
    },
} as const;