function makeNotesArray(){
  return [
    {
      id: '6336f40d-33c2-45cd-937c-3f955f6f95db',
      note_name: 'Hello',
      content: 'this is the first note',
      modified: '2020-08-25T08:34:13.000Z',
      folder_id: 'bbb2bb1a-e666-11ea-adc1-0242ac120002'
    },
    {
      id: 'e14a3a91-e17a-42c9-b1d0-59ae241c9da6',
      note_name: 'Goodbye',
      content: 'this is the second note',
      modified: '2020-08-25T08:34:13.000Z',
      folder_id: 'bbb2bb1a-e666-11ea-adc1-0242ac120002'
    },
    {
      id: '768827de-da04-4c72-b8eb-e4e00861e209',
      note_name: 'Sup',
      content: 'this is the third note',
      modified: '2020-08-25T08:34:13.000Z',
      folder_id: 'c6c75db2-e666-11ea-adc1-0242ac120002'
    }
  ];
}

function makeMaliciousNoteEntry() {
  const maliciousNote = [
    {
      id: 'b5d84772-a26b-4b16-a976-62f1bd37b8e6',
      note_name: 'evil note <script>alert("xss");</script',
      content: 'evil note content <script>alert("xss");</script',
      modified: '2020-08-25T08:34:13.000Z',
      folder_id: 'cbf183f8-e666-11ea-adc1-0242ac120002'
    }
  ];
  const expectedNote = [
    {
      id: 'b5d84772-a26b-4b16-a976-62f1bd37b8e6',
      note_name: 'evil note &lt;script&gt;alert("xss");&lt;/script',
      content: 'evil note content &lt;script&gt;alert("xss");&lt;/script',
      modified: '2020-08-25T08:34:13.000Z',
      folder_id: 'cbf183f8-e666-11ea-adc1-0242ac120002'
    }
  ];

  return {
    maliciousNote,
    expectedNote
  };
}

module.exports = {
  makeNotesArray,
  makeMaliciousNoteEntry
};