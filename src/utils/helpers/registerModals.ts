import { Client } from "discord.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

async function registerModals(client: Client): Promise<void> {
    const dir = path.resolve(__dirname, '../modals');
    fs.readdirSync(dir).forEach(async (file) => {
        if (file === 'index.ts' || file === 'index.js' || file === 'createActionRow.ts') return; // Skip certain files
        const filePath = path.join(dir, file);
        try {
            const mod = await import(pathToFileURL(filePath).toString());
            
            const modalHandler = mod.handler ?? mod;
            if (modalHandler && typeof modalHandler === 'function') {
                const modalName = file.replace(/\.(ts|js)$/, '');
                client.modals.set(modalName, modalHandler);
                console.log(`Registered modal: ${modalName}`);
            } else {
                console.warn(
                    `[WARNING] The modal module at ${filePath} is missing a required "handler" function.`
                );
            }
        } catch (err) {
            console.error(`Failed loading or registering modal from ${filePath}:`, err);
        }
    });
}

export { registerModals };