import { MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
		
		pgm.createTable('users', {
				
				user_id: { 
						type: 'uuid', 
						primaryKey: true, 
						notNull: true, 
						default: new PgLiteral('uuid_generate_v4()')		
				},
				email: { type: 'varchar(50)', notNull: true, unique: true },
				password_hash: { type: 'varchar(255)', notNull: true },
				first_name: { type: 'varchar(50)' },
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
		});

		pgm.createIndex('users', 'email')
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
