import { PgLiteral, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

		pgm.createTable('orders', {
				order_id: { 
						type: 'uuid', 
						primaryKey: true, 
						notNull: true, 
						default: new PgLiteral('uuid_generate_v4()')		
				},
				user_id: { type: 'uuid', unique: true, notNull: true },
				product_id: { type: 'uuid', unique: true, notNull: true },
				quantity: { type: 'integer', notNull: true },
				status: { type: 'text', notNull: true },
				amount: { type: 'decimal(10, 2)', notNull: true },

				payment_id: { type: 'uuid', notNull: true },
				payment_status: { 
						type: 'varchar(50)', 
						notNull: true,
						default: 'PENDING'
				},
				payment_method: { type: 'varchar(50)' },

				shipping_address: { type: 'varchar(50)' },
				shipped_at: { type: 'timestamp with time zone' },

				reserved_at: { type: 'timestamp with time zone', notNull: true },
				expires_at: { type: 'timestamp with time zone', notNull: true },
				created_at: { 
						type: 'timestamp with time zone',
						notNull: true,
						default: pgm.func('current_timestamp'),
				},

				updated_at: { 
						type: 'timestamp with time zone',
						notNull: true,
						default: pgm.func('current_timestamp'),
				},
		})
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
