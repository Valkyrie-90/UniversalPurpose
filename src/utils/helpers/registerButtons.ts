import { Client } from "discord.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

async function registerButtons(client: Client): Promise<void> {
    const dir = path.resolve(__dirname, '../buttons');
    fs.readdirSync(dir).forEach(async (file) => {
        if (file === 'index.ts' || file === 'index.js' || file === 'createActionRow.ts') return; // Skip certain files
        const filePath = path.join(dir, file);
        try {
            const mod = await import(pathToFileURL(filePath).toString());
            
            const buttonHandler = mod.handler ?? mod;
            if (buttonHandler && typeof buttonHandler === 'function') {
                const buttonName = file.replace(/\.(ts|js)$/, '');
                client.buttons.set(buttonName, buttonHandler);
                console.log(`Registered button: ${buttonName}`);
            } else {
                console.warn(
                    `[WARNING] The button module at ${filePath} is missing a required "handler" function.`
                );
            }
        } catch (err) {
            console.error(`Failed loading or registering button from ${filePath}:`, err);
        }
    });
}

export { registerButtons };