import { MessageEvent } from "@line/bot-sdk";
import assert from 'assert';
import { Duration } from "luxon";
import { asiaTime, DATE_FORMAT, db, parseTime, PREFIX } from '../utils/handlers';
import { Command } from "../utils/types";

export class AddCommand extends Command {

    public async execute(event: MessageEvent, args: string[]): Promise<void> {
        if (args.length < 3) {
            this.client.replyMessage(event.replyToken, {
                type: 'text',
                text: `Invalid usage! Format: ${PREFIX} add <${DATE_FORMAT}> <message>`
            });
            return;
        }

        const { source } = event;

        const inputDueDate = args.splice(0, 2).join(' ');
        const messages = args.join(' ');

        try {
            const time = parseTime(inputDueDate);
            const diff = time.toMillis() - asiaTime().toMillis();

            assert(time.toFormat(DATE_FORMAT) === inputDueDate);
            assert(diff > 0);

            const timeLimitDays = 60;
            if (Duration.fromMillis(diff).as('days') > timeLimitDays) {
                this.client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: `Reminder cannot be set greater than ${timeLimitDays} days from today!`
                });
            } else {
                db.addReminder({
                    dueDate: inputDueDate,
                    message: messages,
                    source: {
                        type: source.type,
                        id: (source.type === 'user' ? source.userId : (source.type === 'group' ? source.groupId : source.roomId))
                    }
                });

                this.client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: 'Added your reminder to the bot! I will remind you when the time comes!'
                });
            }
        } catch (err) {
            this.client.replyMessage(event.replyToken, {
                type: 'text',
                text: 'The date set is invalid! Please enter a valid date!'
            });
        }
    }

}