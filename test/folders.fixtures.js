function makeFoldersArray(){
  return [
    {
      id: 'bbb2bb1a-e666-11ea-adc1-0242ac120002',
      folder_name: 'First Folder'
    },
    {
      id: 'c6c75db2-e666-11ea-adc1-0242ac120002',
      folder_name: 'Second Folder'
    },
    {
      id: 'cbf183f8-e666-11ea-adc1-0242ac120002',
      folder_name:'Third Folder'

    }
  ];
} 

function makeMaliciousEntry() {
  const maliciousFolder = [
    {
      id: 'cbf183f8-e666-11ea-adc1-0242ac120003',
      folder_name:'Third Folder <script>alert("xss");</script'
    }
  ];

  const expectedFolder = [
    {
      id: 'cbf183f8-e666-11ea-adc1-0242ac120003',
      folder_name: 'Third Folder &lt;script&gt;alert("xss");&lt;/script'
    }
  ];

  return {
    maliciousFolder,
    expectedFolder
  };
}

module.exports = {
  makeFoldersArray,
  makeMaliciousEntry
};