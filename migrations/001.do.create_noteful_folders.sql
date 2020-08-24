create extension if not exists "uuid-ossp";

drop table if exists Folders;

CREATE TABLE Folders
(
  id uuid default uuid_generate_v4(),
  folder_name text NOT NULL,
  PRIMARY KEY (id)
);