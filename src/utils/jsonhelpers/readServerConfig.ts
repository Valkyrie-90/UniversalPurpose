import { resolve } from "path";
import { readFileSync, accessSync} from "fs";

export function readServerConfig(guildId: string): any | null {
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