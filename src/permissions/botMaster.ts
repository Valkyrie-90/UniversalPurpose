import { Interaction } from "discord.js";
import { BOT_MASTER_ROLE_NAME } from "../config";

function isBotMaster(interaction: Interaction, userId: string): boolean {
    if (!interaction.guild) return false;
    const member = interaction.guild.members.cache.get(userId) ?? (interaction.member as any);
    if (!member || !member.roles?.cache) return false;
    return member.roles.cache.some((r: { name: string; }) => r.name === BOT_MASTER_ROLE_NAME);
}

export { isBotMaster };