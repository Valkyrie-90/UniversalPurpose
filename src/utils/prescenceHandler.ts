import { Client, ActivityType } from "discord.js";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function presenceHandler(client: Client): Promise<void> {
    if (!client.user) {
        console.error("Client user is not defined.");
        return;
    }

    // Fetch guilds
    const guilds = await client.guilds.fetch();

    // Collect guild names
    const botGuilds: string[] = [];

    // @ts-expect-error discord.js types are sometimes out of date
    for (const [, guild] of guilds) {
        const g = await guild.fetch();
        botGuilds.push(g.name);
    }

    // Handle case with no guilds
    if (botGuilds.length === 0) {
        console.warn("Bot is not in any guilds.");
        return;
    }

    // Exclude specific guild(s) from presence rotation
    botGuilds.includes("UP Testing Guild") ? botGuilds.splice(botGuilds.indexOf("UP Testing Guild"), 1) : null;
    botGuilds.includes("UPT2") ? botGuilds.splice(botGuilds.indexOf("UPT2"), 1) : null;

    // Declare index outside the loop
    let index = 0;

    // Infinite loop to rotate presence
    while (true) {
        const guildName = botGuilds[index];

        try {
            client.user.setPresence({
                status: "online",
                activities: [
                    {
                        name: `Protecting: ${guildName}`,
                        type: ActivityType.Watching,
                    },
                ],
            });
        } catch (error) {
            console.error("Error setting bot presence:", error);
        }

        if (botGuilds.length === 1) break; // Only one guild, no need to loop

        index = (index + 1) % botGuilds.length;

        // VERY IMPORTANT — yield to event loop
        await sleep(20_000); // 20 seconds (safe for Discord)
    }
}

export { presenceHandler };