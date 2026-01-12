import { resolve } from "path";
import { readFileSync, accessSync} from "fs";

type ServerConfig = {
    logChannelID: string | null;
    commandsChannelID: string | null;
    botMasterRoleID: string | null;
    globalBanRoleID: string | null;
    privateGuild: boolean;
    filteredChannelIDs: string[];
    disabledCommands: string[];
};

function readServerConfig(guildId: string): ServerConfig | null {
    const configPath = resolve(__dirname, `../../guilds/${guildId}/settings/config.json`);

    try {
        accessSync(configPath);
        const data = readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading config for guild ${guildId}:`, err);
        return null;
    }
}

export { readServerConfig };