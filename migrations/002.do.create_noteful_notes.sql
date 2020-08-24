create extension if not exists "uuid-ossp";

drop table if exists Notes;

CREATE TABLE Notes
(
  id uuid default uuid_generate_v4(),
  noteName text NOT NULL,
  content text NOT NULL,
  modified TIMESTAMPTZ NOT NULL default now(),
  folderId CHAR NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (folderId) REFERENCES Folders(id) on delete cascade not null
);