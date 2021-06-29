import * as line from '@line/bot-sdk';
import { WebhookEvent } from '@line/bot-sdk';
import { BotEvent } from '../utils/types';

export class EchoMessageEvent extends BotEvent {

    public async call(event: WebhookEvent): Promise<void> {
        event = event as line.MessageEvent;

        if (event.message.type === 'text') {
            await this.client.replyMessage(event.replyToken, {
                type: 'text',
                text: 'ECHO: ' + event.message.text
            });
        }
    }

}