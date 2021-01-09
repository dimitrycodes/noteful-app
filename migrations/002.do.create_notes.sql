CREATE TABLE notes (
  id serial,
  title varchar(100) NOT NULL,
  content varchar(255),
  folderId integer NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (folderId) REFERENCES folders(id) ON DELETE CASCADE
);
