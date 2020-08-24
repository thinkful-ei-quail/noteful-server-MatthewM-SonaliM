require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');

describe('NOTEFUL endpoints', () => {
  let db;
  before('establish knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('Disconnect from db', () => db.destroy());
  before('Cleanup', () => db.raw('TRUNCATE folders RESTART IDENTITY CASCADE'));
  afterEach('Cleanup', () => db.raw('TRUNCATE folders RESTART IDENTITY CASCADE'));

  describe('GET /folders', () => {
    context('Given no folders in the database.', () => {
      it('Returns with a 200 and an empty array.', () => {
        return supertest(app)
          .get('/folders')
          .expect(200, []);
      });
    });
  });
});