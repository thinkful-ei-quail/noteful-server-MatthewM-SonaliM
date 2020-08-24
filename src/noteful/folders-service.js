const FoldersService ={
  getAllFolders(db) {
    return db('folders').select('*');
  }
};

module.exports = FoldersService;