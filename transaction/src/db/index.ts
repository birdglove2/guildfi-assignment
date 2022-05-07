import { logger } from '@gfassignment/common';

export enum TABLES {
  Transaction = 'transaction',
  TransactionRecord = 'transaction_record',
  User = 'user',
}

// Connect postgresql
export const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DBNAME,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
  },
});

export const createDbTables = async () => {
  try {
    // console.log('HOST', process.env.POSTGRES_HOST);
    // console.log('USER', process.env.POSTGRES_USER);
    // console.log('NAME', process.env.POSTGRES_DBNAME);
    // console.log('PASSWORD', process.env.POSTGRES_PASSWORD);
    // console.log('PORT', process.env.POSTGRES_PORT);
    await knex.schema.dropTableIfExists(TABLES.TransactionRecord);
    await knex.schema.dropTableIfExists(TABLES.Transaction);
    await knex.schema.dropTableIfExists(TABLES.User);

    // ----- Transaction Schema ------
    await knex.schema.createTable(TABLES.Transaction, (table: any) => {
      table.string('hash').primary();
      table.string('from').notNullable();
      table.string('to').notNullable();
      table.string('method').notNullable();
      table.string('amount').notNullable();
      table.string('gas').notNullable();
      table.integer('block').notNullable();
      table.string('blockHash').notNullable();
      table.integer('nonce').notNullable();
      table.integer('timestamp').notNullable();
    });
    // ----- ------------------------ ------

    // ----- User Schema ------
    await knex.schema.createTable(TABLES.User, (table: any) => {
      table.string('authId').primary();
      table.string('walletAddress').notNullable();
    });
    // ----- ------------------------ ------

    // ----- Transaction Record Schema ------
    await knex.schema.createTable(TABLES.TransactionRecord, (table: any) => {
      // table.primary(['userAuthId', 'txHash']);
      table.string('userAuthId').notNullable().references('authId').inTable(TABLES.User);
      table.string('txHash').notNullable().references('hash').inTable(TABLES.Transaction);
      table.boolean('isCredit').notNullable();
      table.string('accountType').notNullable();
    });
    // ----- ------------------------ ------

    if (process.env.APP_ENV === 'local') {
      // insert for testing purpose
      await knex(TABLES.Transaction).insert({
        hash: 'tx1',
        from: 'bird',
        to: 'micky',
        method: 'transfer',
        amount: '20',
        gas: '2',
        block: 2342,
        blockHash: 'ads',
        nonce: 2,
        timestamp: 213130123,
      });
      await knex(TABLES.User).insert({
        authId: '12313',
        walletAddress: 'xxx',
      });
      await knex(TABLES.TransactionRecord).insert({
        userAuthId: '12313',
        txHash: 'tx1',
        isCredit: false,
        accountType: 'adsasd',
      });

      await knex(TABLES.User).insert({
        walletAddress: '0x7fDBf34B6a59b9E0baF98032f53b8a8eBC1ba65F',
        authId: '6274f06d5c5f0216c0760342',
      });
      await knex(TABLES.User).insert({
        walletAddress: '0xEc2B5522F284650784966E38F5f035082Ef72749',
        authId: '6274f11189400bcd48b28eaf',
      });
    }
  } catch (err) {
    logger.error('Postgres Error!', err);
  }
};
