import { Collection, Db, MongoClient } from 'mongodb';
import { asiaTime, DATE_FORMAT } from './handlers';
import { ReminderData } from './types';

export class ReminderDB {

    public client: MongoClient | undefined;
    public db: Db | undefined;
    public docs: Collection | undefined;

    async connectToDB(): Promise<void> {
        this.client = await MongoClient.connect(process.env.MONGODB_URL!);
        this.db = this.client.db();
        this.docs = this.db.collection('docs');
    }

    async addReminder(data: ReminderData): Promise<void> {
        await this.docs!.insertOne(data);
    }

    async getAllDueReminder(): Promise<ReminderData[]> {
        const time = asiaTime();
        const res = await this.docs!.find({ 'dueDate': time.toFormat(DATE_FORMAT) });

        return res.toArray();
    }

}