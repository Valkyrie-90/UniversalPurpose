import fs from "fs";

const blacklist = new Set<string>();

function loadBlacklistFromStorage(): void {
    fs.readFile("./storage/blacklist.json", "utf8", (err, data) => {
        if (err) {
            if (err.code === "ENOENT") {
                // File does not exist, start with an empty blacklist
                console.log("No existing blacklist found, starting fresh.");
                return;
            } else {
                console.error("Error reading blacklist file:", err);
                return;
            }
        }
        try {
            const parsedData: string[] = JSON.parse(data);
            parsedData.forEach((userId) => blacklist.add(userId));
            console.log("Blacklist loaded from storage.");
        } catch (parseErr) {
            console.error("Error parsing blacklist file:", parseErr);
        }
    });
}

function isBlacklisted(userId: string): boolean {
    return blacklist.has(userId);
}

function addToBlacklist(userId: string): void {
    blacklist.add(userId);

    // Save the updated blacklist to storage
    fs.writeFile(
        "./storage/blacklist.json",
        JSON.stringify(Array.from(blacklist)),
        (err) => {
            if (err) {
                console.error("Error saving blacklist to storage:", err);
            } else {
                console.log("Blacklist updated in storage.");
            }
        }
    );
}

function removeFromBlacklist(userId: string): void {
    blacklist.delete(userId);

    // Save the updated blacklist to storage
    fs.writeFile(
        "./storage/blacklist.json",
        JSON.stringify(Array.from(blacklist)),
        (err) => {
            if (err) {
                console.error("Error saving blacklist to storage:", err);
            } else {
                console.log("Blacklist updated in storage.");
            }
        }
    );
}

export { isBlacklisted, addToBlacklist, removeFromBlacklist, loadBlacklistFromStorage };