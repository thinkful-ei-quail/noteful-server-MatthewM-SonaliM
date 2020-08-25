const FoldersService ={
  getAllFolders(db) {
    return db('folders').select('*');
  },
  getFolderById(db, folderId) {
    return db('folders')
      .select('*')
      .where('id', folderId)
      .first();
  },
  createNewFolder(db, newFolder) {
    return db('folders')
      .insert(newFolder)
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  }
};

module.exports = FoldersService;