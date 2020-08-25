const NotesService ={
  getAllNotes(db) {
    return db('notes').select('*');
  }
};

module.exports = NotesService;