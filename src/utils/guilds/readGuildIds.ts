import fs from 'fs';
import path from 'path';

function readGuildIds() {
    const guildsPath = path.resolve(__dirname, "..", "..", "guilds");
    if (!fs.existsSync(guildsPath)) {
        console.warn(`Guilds folder not found at ${guildsPath}`);
        return [];
    }

    // Read all guild IDs (folder names) in the guilds directory
    const guildIds = fs.readdirSync(guildsPath)

    return guildIds;
}

export { readGuildIds };