heroku run psql -h <HOST> -p 5432 -U <USERNAME> <DBNAME>

\d

INSERT INTO Blogs (author, url, title) values ('test author', 'test url', 'test title');

INSERT INTO Blogs (author, url, title) values ('test author2', 'test url2', 'test title2');

SELECT * FROM Blogs;