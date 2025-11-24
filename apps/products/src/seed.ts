import fs from 'node:fs';
import { parse } from 'csv-parse';
import pg from 'pg';
import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { createClient  } from 'redis';
import path from 'path';


const filePath = path.join(process.cwd(),'flash_sale_items.csv')
dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;


/* const kafka = new Kafka({
		clientId: 'flash-sale',
		brokers: [process.env.KAFKA_BROKE: 'timestamp',
		created: { 
				type: 'timestamp',
						notNull: true,
						default: pgm.func('current_timestamp')
		}, notNull: trueR],
		limit_per_customer:; { type: 'integer', notNull: true }
})
sale_end: { type }

const producer = kafka.producer();
*/

const rClient = createClient({
		url : 'redis://127.0.0.1:6379',
});


rClient.on('error', err => console.log('Redis Client Error', err));


export async function seedDBCSV() {

		/* const client = new Client({
				connectionString,
		}); */

		const pool = new Pool({
				max: 20,
				user: 'myuser',
				database: 'flashdb',
				port: 5432,
				host: '127.0.0.1',
				password:'supersecret'
		});

	//	await client.connect();

		await rClient.connect();

		const parser = fs.createReadStream(filePath, { encoding: 'utf-8' })
				.pipe(parse({ columns: true }));

		for await(const record of parser) {
			const {
				
				productId,
				title,
				category,
				price,
				originalPrice,
				inventory,
				reserved,
				saleStart,
				saleEnd,
				limitPerCustomer,
				status
			}	 = record;

			console.log(`Record row`, record);

		  try {



				await pool.query('BEGIN');

				const start = new Date(saleStart);
				const end =   new Date(saleEnd);

				const productRows = await pool.query(
						`INSERT INTO flash_sale_items(product_id, 
								title, category, price, inventory,
								reserved, sale_start, sale_end, limit_per_customer,
								status)
						VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
						RETURNING id`,
						[  productId, title, category, Number(price),
						   Number(inventory), Number(reserved), start, end, 
						   Number(limitPerCustomer), status 
						]
				);

				const endDate = new Date(saleEnd);
				const now = Date.now();

				const id = productRows.rows[0].id;
				
				let ttlSeconds = Math.floor((endDate.getTime() - now) / 1000);
				if (ttlSeconds > 0) {
						await rClient.hSet(`flash_sale_product:${id}`, {
								id,
								title, 
								category,
								price,
								available_stock: inventory
						});

						await rClient.expire(`flash_sale_product:${id}`, ttlSeconds)



						await rClient.zAdd(`category:${category}:by_price`,{
								score: Number(price),
								value: id
						});

				} 
				await pool.query("COMMIT");
				  
		  } catch(err) {
				console.log(`DB Seeding error`, err);
				throw err;
				await pool.query("ROLLBACK");
		  } finally {
		  }
		}

				await pool.end();
				await rClient.quit();
}

seedDBCSV()


