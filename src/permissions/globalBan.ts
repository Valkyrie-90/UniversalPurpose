import { GuildMember, Interaction } from "discord.js";
import fs from "fs";
import path from "path";

async function hasBanHammer(interaction: Interaction): Promise<boolean> {
    if (!interaction.guild) return false;
    const member = interaction.guild.members.cache.get(interaction.user.id) ?? (interaction.member as GuildMember);
    if (!member || !member.roles?.cache) return false;
    const guildId = interaction.guild.id;

    // Read the config file for the guild
    const guildPath = path.resolve(__dirname, `../guilds/`);
    fs.readFile(`${guildPath}/${guildId}/settings/config.json`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return false;
        }
        try {
            const config = JSON.parse(data);
            const banHammerRoleID = config.globalBanRoleID;
            const banHammer = interaction.guild?.roles.cache.get(banHammerRoleID);
            if (banHammerRoleID && member.roles.cache.has(banHammer?.name ? banHammer.id : '')) {
                return true;
            }
        } catch (parseErr) {
            console.error(parseErr);
            return false;
        }
    });
    return false;
}

export { hasBanHammer };