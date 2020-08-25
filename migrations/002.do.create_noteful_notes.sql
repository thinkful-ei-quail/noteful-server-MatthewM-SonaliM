create extension if not exists "uuid-ossp";

DROP TABLE IF EXISTS notes;

CREATE TABLE notes
(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_name TEXT NOT NULL,
  content TEXT NOT NULL,
  modified TIMESTAMPTZ NOT NULL DEFAULT now(),
  folder_id uuid REFERENCES folders(id) ON DELETE CASCADE NOT NULL
);