require('dotenv').config();
const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const { makeFoldersArray, makeMaliciousEntry } = require('./folders.fixtures');
const { makeNotesArray, makeMaliciousNoteEntry } = require('./notes.fixtures');
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
      const { maliciousFolder, expectedFolder } = makeMaliciousEntry();

      beforeEach('insert malicious entry', () => {
        return db('folders')
          .insert(maliciousFolder);
      });

      it('Removes XSS attack content', () => {
        return supertest(app)
          .get('/folders')
          .expect(200)
          .then(res => {
            expect(res.body[0].id).to.eql(expectedFolder.id);
            expect(res.body[0].folder_name).to.eql(expectedFolder.folder_name);
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

    context('Given there are folders in the folder database', () => {
      const foldersArray = makeFoldersArray();

      beforeEach('insert folders into database', () => {
        return db('folders')
          .insert(foldersArray);
      });

      it('responds with 404, when folder id does not exist', () => {
        const folderId = 'cbf183f8-e666-11ea-adc1-0242ac130004';
        return supertest(app)
          .get(`/folders/${folderId}`)
          .expect(404, { error: { message: 'Folder does not exist' } } );
      });

      it('returns the specified folder from the database', () => {
        let expectedFolder = foldersArray[1];
        return supertest(app)
          .get(`/folders/c6c75db2-e666-11ea-adc1-0242ac120002`)
          .expect(200)
          .expect(expectedFolder);
      });

    });
  });
  
  describe('GET /notes', () => {
    context('Given no notes in the database.', () => {
      it('Returns with a 200 and an empty array.', () => {
        return supertest(app)
          .get('/notes')
          .expect(200, []);
      });
    });

    context('Given there are notes in the database.', () => {
      const testFolders = makeFoldersArray();
      const testNotes = makeNotesArray();

      beforeEach('Insert folders into database', () => {
        return db('folders')
          .insert(testFolders);
      });
      beforeEach('Insert notes into database', () => {
        return db('notes')
          .insert(testNotes);
      });

      it('Responds with 200 and returns all of the notes', () => {
        return supertest(app)
          .get('/notes')
          .expect(200, testNotes);
      });
    });

    context('Given an XSS attack notes', () => {
      const testFolders = makeFoldersArray();
      const { maliciousNote, expectedNote } = makeMaliciousNoteEntry();

      beforeEach('Insert folders into database', () => {
        return db('folders')
          .insert(testFolders);
      });

      beforeEach('Insert malicious note entry', () => {
        return db('notes')
          .insert(maliciousNote);
      });

      it('Removes malicious XSS attack content', () => {
        return supertest(app)
          .get('/notes')
          .expect(200)
          .expect(res => {
            expect(res.body[0]).to.eql(expectedNote);
          });
      });
    });
  });

  describe('GET /notes/:noteid', () => {
    context('Given no notes', () => {
      it('Responds with a 404', () => {
        const noteId = '6336f40d-33c2-45cd-937c-3f955f6f95db';
        return supertest(app)
          .get(`/notes/${noteId}`)
          .expect(404, {error: { message: 'Note does not exist'}});
      });
    });

    context('Given there are notes in the database.', () => {
      const testFolders = makeFoldersArray();
      const testNotes = makeNotesArray();

      beforeEach('Insert folders and notes into database', () => {
        return db
          .into('folders')
          .insert(testFolders)
          .then(() => {
            return db
              .into('notes')
              .insert(testNotes);
          });

      });

      it('Responds with 404 if note id does not exist', () => {
        const noteId = '7336f40d-33c2-45cd-937c-3f955f6f95db';
        return supertest(app)
          .get(`/notes/${noteId}`)
          .expect(404, {error: {message: 'Note does not exist'}});
      });

      it('Returns the specified note from the database', () => {
        const expectedNote = testNotes[1];
        return supertest(app)
          .get('/notes/e14a3a91-e17a-42c9-b1d0-59ae241c9da6')
          .expect(200, expectedNote);
      });
    });
  });

  describe('POST /folders', () => {
    it('creates a folder responding with 201 with new folder', () => {
      const newFolder = {
        folder_name: 'New Folder'
      };

      return supertest(app)
        .post('/folders')
        .send(newFolder)
        .expect(201)
        .expect(res => {
          expect(res.body.folder_name).to.eql(newFolder.folder_name);
          expect(res.body.id);
        });
    });

    it('returns 400 when there is no folder name provided', () =>{
      const newFolder = {
        folder_name: ''
      };

      return supertest(app)
        .post('/folders')
        .send(newFolder)
        .expect(400, { error : { message: 'Folder name is required' } });
    });

    it('Removes malicious XSS attack before inserting', () => {
      const { maliciousFolder, expectedFolder } = makeMaliciousEntry();
      
      return supertest(app)
        .post('/folders')
        .send(maliciousFolder)
        .expect(201)
        .expect(res => {
          expect(res.body.folder_name).to.eql(expectedFolder.folder_name);
        })
        .then(res => 
          supertest(app)
            .get(`/folders/${res.body.id}`)
            .expect(res.body)
        );
    });
  });
  
  describe('POST /notes', () => {
    const testFolders = makeFoldersArray();
    beforeEach('Create test folderd', () => {
      return db('folders')
        .insert(testFolders);
    });

    it('Create a new note responding with 201 with a new note', () => {
      const testNote = makeNotesArray()[0];
      return supertest(app)
        .post('/notes')
        .send(testNote)
        .expect(201)
        .expect(res => {
          expect(res.body.note_name).to.eql(testNote.note_name);
          expect(res.body.content).to.eql(testNote.content);
          expect(res.body.folder_id).to.eql(testNote.folder_id);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/notes/${res.body.id}`);
        })
        .then(res => 
          supertest(app)
            .get(`/notes/${res.body.id}`)
            .expect(res.body)
        );
    });

    const requiredFields = ['note_name', 'content', 'folder_id'];
    requiredFields.forEach(field => {
      const newNote = {
        note_name: 'Test new note',
        content: 'Test new conent',
        folder_id: 'bbb2bb1a-e666-11ea-adc1-0242ac120002'
      };

      it(`Responds with a 400 and an error message when the '${field}' is missing`, () => {
        delete newNote[field];
        return supertest(app)
          .post('/notes')
          .send(newNote)
          .expect(400, {error: {message: `Missing '${field}' in request body`}});
      });
    });

    it('Removes xss attack content from the response', () => {
      const { maliciousNote, expectedNote } = makeMaliciousNoteEntry();
      return supertest(app)
        .post('/notes')
        .send(maliciousNote)
        .expect(201)
        .expect(res => {
          expect(res.body.note_name).to.eql(expectedNote.note_name);
          expect(res.body.content).to.eql(expectedNote.content);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('modified');
          expect(res.body).to.have.property('folder_id');
        });
    });
  });

  describe.only('DELETE /notes/:noteid endpoint', ()=> {
    //delete when theres no folder
    context('there are no folders in the database', () => {
      it('responds with 404 no data found',() => {
        return supertest(app)
          .delete(`/notes/bbb2bb1a-e666-11ea-adc1-0242ac120002`)
          .expect(404, { error: { message: 'Note does not exist' }});

      });
    });
    //delete when folder and notes 

    context('there are folders and notes in database', () => {
      const testFolders = makeFoldersArray();
      const testNotes = makeNotesArray();
      beforeEach('insert folders to database', () => {
        return db('folders')
          .insert(testFolders)
          .then(()=> {
            return db('notes')
              .insert(testNotes);
          });
      });

      it('should delete a note when id provided', () => {
        const expectedNotes = testNotes.filter(note => note.id !== 'e14a3a91-e17a-42c9-b1d0-59ae241c9da6');
        return supertest(app)
          .delete('/notes/e14a3a91-e17a-42c9-b1d0-59ae241c9da6')
          .expect(204)
          .then( () => {
            return supertest(app)
              .get('/notes')
              .then(res => {
                expect(200);
                expect(res.body).to.eql(expectedNotes);
              });
          });
      });

    });
  });

});