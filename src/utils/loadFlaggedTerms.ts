import fs from 'fs';
import path from 'path';

interface FlaggedTerms {
  terms: string[];
}

function loadFlaggedTerms(): string[] {
    try {
        const filePath = path.resolve(__dirname, "..", "storage", "flagged_terms.json");
        const data = fs.readFileSync(filePath, "utf8");
        const parsedData: FlaggedTerms = JSON.parse(data);

        if (Array.isArray(parsedData.terms) && parsedData.terms.every((t) => typeof t === "string")) {
            console.log("Flagged terms loaded from storage.");
            return parsedData.terms;
        } else {
            console.error("Flagged terms file does not contain a string array, starting fresh.");
            return [];
        }
    } catch (err: any) {
        if (err && err.code === "ENOENT") {
            // File does not exist, start with an empty flagged terms list
            console.log("No existing flagged terms found, starting fresh.");
            return [];
        } else {
            console.error("Error reading flagged terms file:", err);
            return [];
        }
    }
}

export { loadFlaggedTerms };