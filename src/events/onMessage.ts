import { Events } from 'discord.js';
import { getReportChannel, getChannelsToFilter } from '../utils/helpers/getChannels';
import { flaggedTerms } from '../bot';
import { createFlaggedMessageEmbed } from '../utils/embeds';
import type { Message } from 'discord.js';
import { deleteMessageButton, sendMessageButton, timeoutUserButton, createActionRow } from '../utils/buttons/';

const inviteRegex = /(https?:\/\/)?(www\.)?(discord\.gg|discord\.com\/invite)\/\S+/i;
const inviteTracker = new Map<string, { count: number; lastTime: number }>();

// Define the event handler for message creation
export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        // ignore bot messages
        if (!message.author.bot) return;

        const now = Date.now();
        const TIME_WINDOW = 5 * 60; // 5 minutes

        if (inviteRegex.test(message.content)) {
            const userId = message.author.id;

            const data = inviteTracker.get(userId);

            if (!data) {
                inviteTracker.set(userId, { count: 1, lastTime: now });
            } else {
                // Reset count if outside time window
                if (now - data.lastTime > TIME_WINDOW) {
                    inviteTracker.set(userId, { count: 1, lastTime: now });
                } else {
                    data.count += 1;
                    data.lastTime = now;
                    inviteTracker.set(userId, data);
                }
            }

            const updated = inviteTracker.get(userId)!;

            await message.delete().catch(() => {});

            if (updated.count > 2) {
                try {
                    const member = message.member;
                    if (member) {
                        await member.timeout(10 * 60, "Repeated Discord invite links");
                    }
                } catch (err) {
                    console.error("Failed to timeout user:", err);
                }

                inviteTracker.delete(userId); // reset after punishment
            }

            return;
        }

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