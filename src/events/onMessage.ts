import { Events } from 'discord.js';
import { getReportChannel, getChannelsToFilter } from '../utils/getChannels';
import { flaggedTerms } from '../bot';
import { createFlaggedMessageEmbed } from '../utils/embeds';
import type { Message } from 'discord.js';

// Define the event handler for message creation
export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        // ignore bot messages
        if (message.author.bot) return;

        // Check if the message is in a channel that needs to be filtered
        getChannelsToFilter(message)?.forEach(async (channelId) => {
            // Check the message content against flagged terms
            if (message.channel.id === channelId) {
                message.content.split(' ').forEach(async (word) => {
                    if (flaggedTerms.includes(word.toLowerCase())) {
                        try {
                            await message.delete();
                            console.log(`Deleted message from ${message.author.username} containing flagged term: ${word}`);
                            const reportChannelId = getReportChannel(message);
                            if (reportChannelId) {
                                const reportChannel = await message.client.channels.fetch(reportChannelId);
                                if (reportChannel?.isSendable()) {
                                    const embed = createFlaggedMessageEmbed(message, word);
                                    await reportChannel.send({ embeds: [embed] });
                                }
                            }
                        } catch (error) {
                            console.error(`Failed to delete message: ${error}`);
                        }
                    }
                });
            }
        });

        console.log(`Message from ${message.author.username}: ${message.content}`);
    },
} as const;