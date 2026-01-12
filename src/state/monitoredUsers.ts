import fs from "fs";

const monitoredUsers = new Set<string>();

function loadMonitoredUsersFromStorage(): void {
    fs.readFile("./storage/monitored_users.json", "utf8", (err, data) => {
        if (err) {
            if (err.code === "ENOENT") {
                // File does not exist, start with an empty monitored_users
                console.log("No existing monitored users found, starting fresh.");
                return;
            } else {
                console.error("Error reading monitored users file:", err);
                return;
            }
        }
        try {
            const parsedData: string[] = JSON.parse(data);
            parsedData.forEach((userId) => monitoredUsers.add(userId));
            console.log("Monitored users loaded from storage.");
        } catch (parseErr) {
            console.error("Error parsing monitored users file:", parseErr);
        }
    });
}

function isMonitored(userId: string): boolean {
    return monitoredUsers.has(userId);
}

function addToMonitoredUsers(userId: string): void {
    monitoredUsers.add(userId);

    // Save the updated monitored_users to storage
    fs.writeFile(
        "./storage/monitored_users.json",
        JSON.stringify(Array.from(monitoredUsers)),
        (err) => {
            if (err) {
                console.error("Error saving monitored users to storage:", err);
            } else {
                console.log("Monitored users updated in storage.");
            }
        }
    );
}

function removeFromMonitoredUsers(userId: string): void {
    monitoredUsers.delete(userId);

    // Save the updated monitored_users to storage
    fs.writeFile(
        "./storage/monitored_users.json",
        JSON.stringify(Array.from(monitoredUsers)),
        (err) => {
            if (err) {
                console.error("Error saving monitored_users to storage:", err);
            } else {
                console.log("Monitored users updated in storage.");
            }
        }
    );
}

export { isMonitored, addToMonitoredUsers, removeFromMonitoredUsers, loadMonitoredUsersFromStorage };