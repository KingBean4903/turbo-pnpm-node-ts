
export async function runOutBoxWorker(producer, pool) {

		await producer.connect();

		while(true) {
				const client = await pool.connect();

				try {
						await client.query('BEGIN');

						const { rows } = client.query(`
								SELECT id, event_type, payload
								FROM outbox
								WHERE processed = false
								ORDER BY id
								FOR UPDATE SKIP LOCKED
								LIMIT 20
													  `);
						if (rows.length === 0) {
								await client.query('ROLLBACK');
								await new Promise((res) => setTimeout(res,  1000));
								continue;
						}

						for (const row of rows) {
								await producer.send({
										topic: row.event_type, 
										message: [
												{
														key: String(row.id),
														value: JSON.stringify(row.payload)
												}
										]
								});
						}


						const ids = rows.map((r) => r.id)
						await client.query(`
								UPDATE outbox SET processed = true WHERE id = ANY($1)`,
										[ids]);
						await client.query('COMMIT')

				} catch(err) {

						await client.query('ROLLBACK');
						console.error('Outbox worker error', err);
						await new Promise((res) => setTimeout(res, 2000));

				} finally {
						client.release();
				}

		}
}  
