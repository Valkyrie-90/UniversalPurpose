import { resolve } from "path";
import { readFileSync, accessSync} from "fs";
import { SetupInfo } from "@up/main/types";

function readServerConfig(guildId: string): SetupInfo | null {
    const configPath = resolve(`data/guilds/${guildId}/settings/config.json`);

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