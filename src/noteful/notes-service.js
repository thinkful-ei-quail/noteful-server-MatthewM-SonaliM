const NotesService ={
  getAllNotes(db) {
    return db('notes').select('*');
  },

  getNoteById(db, id) {
    return db('notes').select('*').where('id', id).first();
  }
};

module.exports = NotesService;