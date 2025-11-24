import {  MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
		
		//pgm.alterColumn('flash_sale_items', 'id', 
		
}

export async function down(pgm: MigrationBuilder): Promise<void> {
		
		pgm.dropColumns('flash_sale_items', 'id');

}
