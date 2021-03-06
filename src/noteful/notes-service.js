const NotesService ={
  getAllNotes(db) {
    return db('notes').select('*');
  },

  getNoteById(db, id) {
    return db('notes').select('*').where('id', id).first();
  },

  createNote(db, newNote) {
    return db('notes').insert(newNote).returning('*').then(rows => rows[0]);
  },
  deleteNote(db, id) {
    return db('notes').where({ id }).delete();
  }
};

module.exports = NotesService;