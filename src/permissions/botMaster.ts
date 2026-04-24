<<<<<<< HEAD
<<<<<<< HEAD
import { GuildMember, Interaction } from "discord.js";
import { readServerConfig } from "../utils/jsonhelpers/readServerConfig";
=======
import { Interaction } from "discord.js";
import { env } from "@up/main/schema";
>>>>>>> 9ae3529 (update tsconfig, package & imports)
=======
import { Interaction } from "discord.js";
import { env } from "@up/main/schema";
>>>>>>> dc093e43ad5cfc99fbd9d76b70bae1caacc94120

function isBotMaster(interaction: Interaction, userId: string): boolean {
    if (!interaction.guild) return false;

    const member = interaction.guild.members.cache.get(userId) ?? (interaction.member as GuildMember);

    if (!member || !member.roles?.cache) return false;
<<<<<<< HEAD
<<<<<<< HEAD

    const serverConfig = readServerConfig(interaction.guild.id);
    if (!serverConfig) {
        return false;
    }

    const botMasterRoleID = serverConfig.botMasterRoleID;
    if (botMasterRoleID && member.roles.cache.has(botMasterRoleID)) {
        return true;
    }

    return false;
=======
    return member.roles.cache.some((r: { name: string; }) => r.name === env.BOT_MASTER_ROLE_NAME);
>>>>>>> 9ae3529 (update tsconfig, package & imports)
=======
    return member.roles.cache.some((r: { name: string; }) => r.name === env.BOT_MASTER_ROLE_NAME);
>>>>>>> dc093e43ad5cfc99fbd9d76b70bae1caacc94120
}

export { isBotMaster };