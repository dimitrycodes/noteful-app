CREATE TABLE notes (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL
  content TEXT NOT NULL
  folderId INTEGER NOT NULL
  FOREIGN KEY (folderId) REFERENCES folders(id) ON DELETE CASCADE
);
