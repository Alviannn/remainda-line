/* eslint-disable @typescript-eslint/no-var-requires */

import { FlexBubble, FlexMessage, MessageEvent } from '@line/bot-sdk';
import path from "path";
import { Command } from "../utils/types";

export class InfoCommand extends Command {

    public async execute(event: MessageEvent): Promise<void> {
        const filePath = path.resolve('./flexes/info.json');
        const infoFlex = require(filePath) as FlexBubble;

        const message: FlexMessage = {
            type: 'flex',
            altText: 'Bot Information',
            contents: infoFlex
        };

        await this.client.replyMessage(event.replyToken, message);
    }

}