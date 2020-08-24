require('dotenv').config();
const knex = require('knex');

describe('NOTEFUL endpoints', () => {
  let foldersCopy, notesCopy, db;
  before('establish knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  
});