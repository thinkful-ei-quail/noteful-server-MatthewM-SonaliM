require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const { makeFoldersArray, makeMaliciousEntry } = require('./folders.fixtures');
const e = require('express');
const { expect } = require('chai');

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
  before('Cleanup', () => db.raw('TRUNCATE Notes, Folders RESTART IDENTITY CASCADE'));
  afterEach('Cleanup', () => db.raw('TRUNCATE Notes, Folders RESTART IDENTITY CASCADE'));

  describe('GET /folders', () => {
    context('Given no folders in the database.', () => {
      it('Returns with a 200 and an empty array.', () => {
        return supertest(app)
          .get('/folders')
          .expect(200, []);
      });
    });

    context('Given there are folders in the folders database', () =>{
      const testFolders = makeFoldersArray();

      beforeEach('insert folders to database', () => {
        return db('folders')
          .insert(testFolders);
      });

      it('responds with 200 and returns all of the folders', () => {
        return supertest(app)
          .get('/folders')
          .expect(200, testFolders);
      });
    });

    context('Given an XSS attack folder', () => {
      const testFolders = makeFoldersArray();
      const { maliciousFolder, expectedFolder } = makeMaliciousEntry();

      beforeEach('insert malicious entry', () => {
        return db('folders')
          .insert(maliciousFolder);
      });

      it('Removes XSS attack content', () => {
        return supertest(app)
          .get('/folders')
          .expect(200)
          .expect(res => {
            // ask during mentor seesion
            expect(res.body[0].id).to.eql(expectedFolder[0].id);
            expect(res.body[0].folder_name).to.eql(expectedFolder[0].folder_name);
          });
      });
    });
  });

  describe('/GET /folders/:folder_id', () => {
    context('Given no folders', () => {
      it('responds with 404', () => {
        const folderId = 'cbf183f8-e666-11ea-adc1-0242ac130004';
        return supertest(app)
          .get(`/folders/${folderId}`)
          .expect(404, { error: { message: 'Folder does not exist' } } );
      });
    });

    // context.('Given there are folders in the folder database', () => {
    //   const foldersArray = makeFoldersArray();

    //   beforeEach()
    // })
  });

});