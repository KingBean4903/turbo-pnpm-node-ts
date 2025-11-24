import {  MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

	/*pgm.alterColumn('flash_sale_items', 'created', 
					{
								type: 'timestamp with time zone',

					})*/	
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
