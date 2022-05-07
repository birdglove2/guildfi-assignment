import { knex, TABLES } from 'db';

export interface UserAttrs {
  authId: string;
  walletAddress: string;
}

export const User = knex(TABLES.User);
