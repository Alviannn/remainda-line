import * as line from '@line/bot-sdk';
import { Client, WebhookEvent } from '@line/bot-sdk';
import { DateTime } from 'luxon';
import { ReminderDB } from './db';
import { BotEvent, Command } from './types';

const events: BotEvent[] = [];
const commands: Command[] = [];

export const PREFIX = 'remainda';
export const CURRENT_TIMEZONE = 'Asia/Jakarta';
export const DATE_FORMAT = 'dd-MM-yyyy HH:mm';

export const db = new ReminderDB();

/**
 * The event handler for command executions
 */
class CommandEvent extends BotEvent {

    public async call(event: WebhookEvent): Promise<void> {
        event = event as line.MessageEvent;

        if (event.message.type !== 'text') {
            return;
        }

        const { message: msg } = event;
        const { text } = msg;

        const args = text.split(' ');
        const prefix = args.shift()!.toLowerCase();

        if (prefix !== PREFIX) {
            return;
        }

        if (!args.length) {
            const helpcmd = commands.find((cmd) => cmd.name === 'help')!;
            await helpcmd.execute(event, []);
        } else {
            const subcmd = args.shift()!.toLowerCase();
            const currcmd = commands.find((cmd) => {
                if (cmd.name === subcmd || cmd.aliases.includes(subcmd)) {
                    return cmd;
                }
            });

            if (currcmd) {
                await currcmd.execute(event, args);
            }
        }
    }

}

/**
 * registers a command to the bot
 */
export function registerCommand(cmd: Command): void {
    commands.push(cmd);
    console.log(`[Handler]: Registered command ${cmd.name}`);
}

/**
 * registers an event to the bot
 */
export function registerEvent(event: BotEvent): void {
    events.push(event);
}

/**
 * registers the command event to the bot
 */
export function registerCommandEvent(client: Client): void {
    registerEvent(new CommandEvent(client, 'message'));
}

/**
 * handles all incoming events from the LINE webhook receiver
 */
export async function handleEvent(event: WebhookEvent): Promise<void> {
    events
        .filter((ev) => ev.type === event.type)
        .map(async (ev) => await ev.call(event));
}

/**
 * gets the current asian time
 */
export function asiaTime(): DateTime {
    return DateTime.utc().setZone(CURRENT_TIMEZONE, { keepLocalTime: false });
}

export function parseTime(value: string): DateTime {
    return DateTime.fromFormat(value, DATE_FORMAT, { zone: CURRENT_TIMEZONE, setZone: true });
}