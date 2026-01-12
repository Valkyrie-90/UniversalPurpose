import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { readGuildIds } from "../guilds";

async function registerCommandsForGuilds(client: Client): Promise<void> {
    const guildIds = readGuildIds();
    for (const guildId of guildIds) {
        const commandsPath = join(__dirname, "..", "..", "guilds", guildId, "commands");
        const commandFiles = readdirSync(commandsPath).filter((file) =>
            file.endsWith('.ts') || file.endsWith('.js')
        );

        for (const file of commandFiles) {
            const filePath = join(commandsPath, file);
            try {
                const mod = await import(filePath);
                const command = (mod && (mod.default ?? mod)) as any;
                if (command && "data" in command && command.execute) {
                    const commandName = command.data.name;
                    client.commands.set(commandName, command);
                    console.log(`Registered guild-specific command: ${commandName} for guild ${guildId}`);
                } else {
                    console.warn(
                        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                    );
                }
            } catch (err) {
                console.error(`Failed loading command ${filePath}:`, err);
            }
        }
    }
}

async function registerCommands(client: Client): Promise<void> {
    const commandsPath = join(__dirname, "..", "..", "commands");
    const commandFiles = readdirSync(commandsPath, { recursive: true }).filter((file) =>
        typeof file === "string" && file.endsWith(".ts")
    );

    for (const file of commandFiles) {
        const fileName = (file as string).split('/').pop(); // Get the raw file name
        const filePath = join(commandsPath, file as string);
        try {
            const mod = await import(filePath);
            const command = (mod && (mod.default ?? mod)) as any;
            if (command && "data" in command && command.execute) {
                if (fileName) {
                    client.commands.set(fileName.replace(".ts", ""), command);
                    console.log(`Registered command: ${fileName.replace(".ts", "")}`);
                }
            } else {
                console.warn(
                    `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                );
            }
        } catch (err) {
            console.error(`Failed loading command ${filePath}:`, err);
        }
    }

    await registerCommandsForGuilds(client).catch((err) => {
        console.error("Error registering guild-specific commands:", err);
    });
}

export { registerCommands };