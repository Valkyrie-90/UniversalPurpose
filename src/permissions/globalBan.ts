import { GuildMember, Interaction } from "discord.js";
import { readServerConfig } from "../utils/jsonhelpers/readServerConfig";
import path from "path";

async function hasBanHammer(interaction: Interaction): Promise<boolean> {
    if (!interaction.guild) return false;
    const member = interaction.guild.members.cache.get(interaction.user.id) ?? (interaction.member as GuildMember);
    if (!member || !member.roles?.cache) return false;
    const guildId = interaction.guild.id;

    // Read the config file for the guild
    const guildPath = path.resolve(__dirname, "..", "guilds");
    const serverConfig = readServerConfig(guildId);
    if (!serverConfig) {
        return false;
    }

    const globalBanRoleID = serverConfig.globalBanRoleID;
    if (globalBanRoleID && member.roles.cache.has(globalBanRoleID)) {
        return true;
    }

    return false;
}

export { hasBanHammer };