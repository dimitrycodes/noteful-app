CREATE TABLE folders (
  id serial,
  name varchar(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (isbn)
);
