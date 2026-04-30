import type { CustomClient, actionMenuListItemNameType, createMenuListItemNameType, menuType } from "@up/main/types";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

async function registerMenus(client: CustomClient): Promise<void> {
    const dir = path.resolve(__dirname, '../menus/elements');
    fs.readdirSync(dir).forEach(async (file) => {
        if (file === 'index.ts' || file === 'index.js' || file === 'createActionRow.ts' || file === 'createMenu.ts') return; // Skip certain files
        const filePath = path.join(dir, file);
        try {
            const mod = await import(pathToFileURL(filePath).toString());
            
            const handler = mod.handler ?? mod;
            if (handler && typeof handler === 'function') {
                const menuName = mod.ticketMenuType as menuType ?? mod;
                                
                if (menuName === "ticketActionMenu") {
                    const listName = file.replace(/\.(ts|js)$/, '') as actionMenuListItemNameType;
                    const listHandler = handler as Function

                    client.menus.ticketActionMenu.set(listName, listHandler)
                } else if (menuName === "ticketCreationMenu") {
                    const listName = file.replace(/\.(ts|js)$/, '') as createMenuListItemNameType;
                    const listHandler = handler as Function

                    client.menus.ticketCreationMenu.set(listName, listHandler)
                } else {
                    throw new Error(`Menu Name: ${menuName} not found.`)
                }

                console.log(`Registered menu: ${menuName}`);
            } else {
                console.warn(
                    `[WARNING] The menu module at ${filePath} is missing a required "handler" function.`
                );
            }
        } catch (err) {
            console.error(`Failed loading or registering menu from ${filePath}:`, err);
        }
    });
}

export { registerMenus };