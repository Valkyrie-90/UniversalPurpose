import { Client, ClientOptions, GatewayIntentBits, Collection, ApplicationCommandData } from "discord.js";

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

// Extension of the discord client with custom fields
export class CustomClient extends Client {
    public commands = new Collection<string, Command>();
    public buttons = new Collection<string, Function>();
    public events = new Collection<string, Event>();
    public modals = new Collection<string, Function>();
    public menus = new Collection<string, Function>();

    public constructor(options: ClientOptions) {
        super(options);
    }
}
