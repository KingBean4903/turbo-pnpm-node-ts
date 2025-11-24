import dotenv from 'dotenv';
import pg from 'pg';
import { Kafka } from 'kafkajs';
import runOutBoxWorker from './outbox_worker';
import seedFromCSVtoDB from './seed'; 
import { createClient  } from 'redis';

const kafka = new Kafka({
		clientId: 'flash-sale',
		brokers: ['kafka1:9092']
});

const producer = kafka.producer();

const client = createClient({
		url : process.env.REDIS_CLIENT,
});

await client.connect();


const { Pool } = pg;

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
		connectionString,
});


runOutBoxWorker(producer, pool);

seedFromCSVtoDB(redis, pool);

