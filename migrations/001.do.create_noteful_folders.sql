create extension if not exists "uuid-ossp";

DROP TABLE IF EXISTS folders;

CREATE TABLE folders
(
  id uuid DEFAULT uuid_generate_v4(),
  folder_name TEXT NOT NULL,
  PRIMARY KEY (id)
);