import { GuildMember, Interaction } from "discord.js";
import { readServerConfig } from "../utils/jsonhelpers/readServerConfig";

function isBotMaster(interaction: Interaction, userId: string): boolean {
    if (!interaction.guild) return false;

    const member = interaction.guild.members.cache.get(userId) ?? (interaction.member as GuildMember);

    if (!member || !member.roles?.cache) return false;

    const serverConfig = readServerConfig(interaction.guild.id);
    if (!serverConfig) {
        return false;
    }

    const botMasterRoleID = serverConfig.botMasterRoleID;
    if (botMasterRoleID && member.roles.cache.has(botMasterRoleID)) {
        return true;
    }

    return false;
}

export { isBotMaster };