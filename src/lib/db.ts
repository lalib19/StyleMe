import { MongoClient, ServerApiVersion } from "mongodb";


export async function connectToDb(): Promise<MongoClient> {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    return client;
}

