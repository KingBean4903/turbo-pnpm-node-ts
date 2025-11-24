import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';
import { Kafka } from 'kafkajs';
import { createClient  } from 'redis';


const kafka = new Kafka({
		clientId: 'flash-sale',
		brokers: [ `${process.env.KAFKA_BROKER}` ]
});

const producer = kafka.producer();

const client = createClient({
		url : process.env.REDIS_URL,
});

await client.connect();


const { Pool } = pg;

dotenv.config();

const app = express();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
		connectionString,
})

app.get("/", (req, res, next) => {
		res.json({ 'success': 'Buddy, we are online'});
});

app.get("/products", async (req, res, next) => {

		let qcursor = req.query.cursor;

		if (qcursor !== undefined) {
				qcursor = qcursor.toString();
				const category = req.query.category;
				const limit  = req.query.limit;
		//		const sort   = req.query.sort;

				const products: any[] = [];

				// const keys = await client.keys(`flash_sale_product:*`);

				// do {
						const { cursor : newCursor, keys } = await client.scan(qcursor, 
														{ MATCH: 'flash_sale_product:*', COUNT: Number(limit) })
						// lCursor = Number(newCursor);

						for (const key of keys) {
								const product = await client.hGetAll(key);
								console.log(product);
								products.push(product);
						}
				// } while (lCursor != 0)	


				return res.json({ message: 'Success', data: products, cursor: newCursor }).status(200)
		} 

		return res.json({ message: 'Error, failed no valid cursor', data: [], cursor: '0' })

})

const PORT = 4500;

app.listen(PORT, () => {
		console.log(`Products running on : ${PORT}`);
})
