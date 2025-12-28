import { Message } from "discord.js";
import { readServerConfig } from "../jsonhelpers/readServerConfig";

function getReportChannel(message: Message): string | undefined {
    const config: any = readServerConfig(message.guild!.id);
    return config ? config.reportChannelID : undefined;
}

function getChannelsToFilter(message: Message) : string[] | undefined {
    const config: any = readServerConfig(message.guild!.id);
    return config ? config.filteredChannelIDs : undefined;
}

export { getReportChannel, getChannelsToFilter };