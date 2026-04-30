import { Client, ClientOptions, GatewayIntentBits, Collection, ApplicationCommandData } from "discord.js";

// Actual cursed tomfoolery
export type menuType = "ticketActionMenu" | "ticketCreationMenu"
export type actionMenuListItemNameType = "assignTicket" | "changeTicketName" | "claimTicket" | "createTicket" | "deleteTicket"
export type createMenuListItemNameType = "createTicket"

export type actionMenuType = {
    name: actionMenuListItemNameType
    handler: Function
}

export type creationMenuType = {
    name: createMenuListItemNameType
    handler: Function
}

// Custom Interface Types for collections
export interface Command {
    data: ApplicationCommandData;
    execute(message: any, args: string[]): void;
}

export interface Event {
    name: string;
    once?: boolean;
    execute: (...args: any[]) => void | Promise<void>;
}

export interface Menu {
    ticketActionMenu: Collection<actionMenuListItemNameType, Function>
    ticketCreationMenu: Collection<createMenuListItemNameType, Function>
}

// Extension of the discord client with custom fields
export class CustomClient extends Client {
    public commands = new Collection<string, Command>();
    public buttons = new Collection<string, Function>();
    public events = new Collection<string, Event>();
    public modals = new Collection<string, Function>();
    public menus: Menu = { ticketActionMenu: new Collection(), ticketCreationMenu: new Collection() }

    public constructor(options: ClientOptions) {
        super(options);
    }
}

// Setup Info Type
export type SetupInfo = {
    logChannelID: string | null;
    commandsChannelID: string | null;
    botMasterRoleID: string | null;
    globalBanRoleID: string | null;
    privateGuild: boolean;
    filteredChannelIDs: string[];
    welcomeChannelID: string | null
    disabledCommands: string[];
};