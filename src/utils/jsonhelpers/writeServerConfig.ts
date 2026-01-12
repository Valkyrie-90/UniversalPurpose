import { resolve } from "path";
import { writeFileSync, mkdirSync } from "fs";
import { readFileSync } from "fs";
import { refreshCommandsForGuild } from "../commands/refreshCommands";

type ServerConfig = {
    logChannelID: string | null;
    commandsChannelID: string | null;
    botMasterRoleID: string | null;
    globalBanRoleID: string | null;
    privateGuild: boolean;
    filteredChannelIDs: string[];
    disabledCommands: string[];
};

export function writeServerConfig(guildId: string, config: ServerConfig): boolean {
    // Ensure the settings directory exists
    const settingsDir = resolve(__dirname, `../../guilds/${guildId}/settings/`);
    try {
        mkdirSync(settingsDir, { recursive: true });
    } catch (err) {
        console.error(`Error creating settings directory for guild ${guildId}:`, err);
        return false;
    }

    // Define the config file path
    const configPath = resolve(__dirname, `../../guilds/${guildId}/settings/config.json`);

    try {
        let existingConfig: ServerConfig | null = null;
        try {
            const fileContent = readFileSync(configPath, 'utf8');
            existingConfig = JSON.parse(fileContent);
        } catch {
            existingConfig = null;
        }

        if (JSON.stringify(existingConfig, null, 4) !== JSON.stringify(config, null, 4)) {
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            refreshCommandsForGuild(guildId).catch((err: Error) => {
                console.error(`Error deploying/refreshing commands for guild ${guildId}:`, err);
            });
        }
        return true;
    } catch (err) {
        console.error(`Error writing config for guild ${guildId}:`, err);
        return false;
    }
}
