import { Interaction } from "discord.js";
import { GBAN_ROLE_NAME } from "../config";

function hasBanHammer(interaction: Interaction): boolean {
    if (!interaction.guild) return false;
    const member = interaction.guild.members.cache.get(interaction.user.id) ?? (interaction.member as any);
    if (!member || !member.roles?.cache) return false;
    return member.roles.cache.some((r: { name: string; }) => r.name === GBAN_ROLE_NAME);
}

export { hasBanHammer };