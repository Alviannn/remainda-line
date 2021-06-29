import { Client, MessageEvent, WebhookEvent } from '@line/bot-sdk';

export type EventTypes = "message" | "unsend" | "follow" | "unfollow" | "join" | "leave" | "memberJoined" | "memberLeft" | "postback" | "videoPlayComplete" | "beacon" | "accountLink" | "things";

export abstract class BotEvent {

    /** the LINE client instance */
    public readonly client: Client;
    /** the event type */
    public readonly type: EventTypes;

    public constructor(client: Client, type: EventTypes) {
        this.client = client;
        this.type = type;
    }

    /**
     * the code to be executed when an event is triggered
     *
     * @param event the triggered event
     */
    public abstract call(event: WebhookEvent): Promise<void>;

}

export abstract class Command {

    /** the command name (that triggers the it) */
    public readonly name: string;
    /** the command aliases (that triggers the it) */
    public readonly aliases: string[];
    /** the LINE client instance */
    public readonly client: Client;

    public constructor(name: string, aliases: string[], client: Client) {
        this.name = name;
        this.aliases = aliases || [];
        this.client = client;
    }

    /**
     * the code to be executed when an event is triggered
     *
     * @param event the triggered message event
     * @param args the command arguments (will be empty array if none)
     */
    public abstract execute(event: MessageEvent, args: string[]): Promise<void>;

}

export type ReminderData = {
    _id: string | undefined,
    dueDate: string,
    source: {
        type: 'user' | 'group' | 'room',
        id: string
    },
    message: string
};