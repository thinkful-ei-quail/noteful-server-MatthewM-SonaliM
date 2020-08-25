const FoldersService ={
  getAllFolders(db) {
    return db('folders').select('*');
  },
  getFolderById(db, folderId) {
    return db('folders')
      .select('*')
      .where('id', folderId)
      .first();
  }
};

module.exports = FoldersService;