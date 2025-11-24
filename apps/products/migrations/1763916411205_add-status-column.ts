import {  MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
		/* pgm.addColumns('flash_sale_items', 
					   {
						  status: {
								type: 'text',
								notNull: true,
						  }
					   }) */
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
