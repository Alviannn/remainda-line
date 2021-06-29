import { MessageEvent } from "@line/bot-sdk";
import { DATE_FORMAT, db, parseTime, PREFIX, asiaTime } from '../utils/handlers';
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

        const dueDate = args.splice(0, 2).join(' ');
        const messages = args.join(' ');

        try {
            const time = parseTime(dueDate);

            if (time.toMillis() - asiaTime().toMillis() < 0) {
                throw Error();
            }

            db.addReminder({
                _id: undefined,
                dueDate,
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
        } catch (err) {
            this.client.replyMessage(event.replyToken, {
                type: 'text',
                text: 'The date set is invalid! Please enter a valid date!'
            });
        }
    }

}