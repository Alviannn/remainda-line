/* eslint-disable @typescript-eslint/no-var-requires */

import { MessageEvent } from '@line/bot-sdk';
import { Command } from "../utils/types";
import { CURRENT_TIMEZONE, DATE_FORMAT, PREFIX } from '../utils/handlers';

export class HelpCommand extends Command {

    public async execute(event: MessageEvent): Promise<void> {
        this.client.replyMessage(event.replyToken, {
            type: 'text',
            text: [
                'COMMAND USAGE',
                '',
                `FORMAT: ${PREFIX} add <${DATE_FORMAT}> <message>`,
                '',
                'Usage example:',
                `${PREFIX} add 29-06-2021 12:30 Let's do homework!`,
                `${PREFIX} add 30-06-2021 21:00 play VALORANT with friends`,
                `${PREFIX} add 29-06-2021 07:00 Have meeting`,
                '',
                'NOTE:',
                `The timezone is on ${CURRENT_TIMEZONE}`,
                'And you can also use "remainda info" to view the bot info :)'
            ].join('\n')
        });
    }

}