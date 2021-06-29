import { WebhookEvent } from '@line/bot-sdk';
import assert from 'assert';
import { db } from '../utils/handlers';
import { BotEvent } from '../utils/types';

export class LeaveEvent extends BotEvent {

    public async call(event: WebhookEvent): Promise<void> {
        assert(event.type === 'leave');
        const { source } = event;

        assert(source.type === 'group' || source.type === 'room');
        const id = (source.type === 'group' ? source.groupId : source.roomId);

        await db.docs!.deleteMany({ 'source.id': id });
    }

}