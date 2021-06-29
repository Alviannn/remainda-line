import * as line from '@line/bot-sdk';
import { WebhookEvent } from '@line/bot-sdk';
import dotenv from 'dotenv';
import express from 'express';
import { AddCommand } from './commands/add';
import { HelpCommand } from './commands/help';
import { InfoCommand } from './commands/info';
import { LeaveEvent } from './events/leave';
import * as handlers from './utils/handlers';

dotenv.config();

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
    channelSecret: process.env.CHANNEL_SECRET!
};

const client = new line.Client(config);
const app = express();

app.get('/', async (_, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Connected successfully!'
    });
});

app.post('/webhook', line.middleware(config), async (req, res) => {
    const events: WebhookEvent[] = req.body.events;
    const results = await Promise.all(
        events.map(async (event) => {
            try {
                await handlers.handleEvent(event);
            } catch (err) {
                console.error(err);
                return res.status(500).json({ status: 'An error has occurred!' });
            }
        })
    );

    return res.status(200).json({
        status: 'success',
        results
    });
});


const port = process.env.PORT || 3000;

app.listen(port, async () => {
    await handlers.db.connectToDB();

    console.log(`Bot is live at port ${port}`);

    handlers.registerCommandEvent(client);
    handlers.registerEvent(new LeaveEvent(client, 'leave'));

    handlers.registerCommand(new InfoCommand('info', ['i', 'information', '?'], client));
    handlers.registerCommand(new HelpCommand('help', ['how'], client));
    handlers.registerCommand(new AddCommand('add', ['remind', 'alert', 'set'], client));

    setInterval(async () => {
        console.log('[REPORT]: Reminder is still running!');

        const { db } = handlers;
        const reminders = await db.getAllDueReminder();

        if (!reminders.length) {
            return;
        }

        for (const reminder of reminders) {
            await client.pushMessage(reminder.source.id, {
                type: 'text',
                text: [
                    'REMINDER DETECTED',
                    '',
                    `Due date: ${reminder.dueDate}`,
                    `Message: ${reminder.message}`
                ].join('\n')
            });

            await db.docs!.deleteOne({ '_id': (reminder as never)['_id'] });
        }
    }, 30_000);
});