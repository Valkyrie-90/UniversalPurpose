import { Message } from "discord.js";
import { readServerConfig } from "../jsonhelpers/readServerConfig";

type ServerConfig = {
    logChannelID: string | null;
    commandsChannelID: string | null;
    botMasterRoleID: string | null;
    globalBanRoleID: string | null;
    privateGuild: boolean;
    filteredChannelIDs: string[];
    disabledCommands: string[];
};

function getReportChannel(message: Message): string | null {
    const config: ServerConfig | undefined = readServerConfig(message.guild!.id);
    return config ? config.logChannelID : null;
}

function getChannelsToFilter(message: Message) : string[] | null {
    const config: ServerConfig | undefined = readServerConfig(message.guild!.id);
    return config ? config.filteredChannelIDs : null;
}

export { getReportChannel, getChannelsToFilter };