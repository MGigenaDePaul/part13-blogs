CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Martin Fowler', 'https://martinfowler.com/articles/microservices.html', 'Microservices', 10);
INSERT INTO blogs (author, url, title, likes) VALUES ('Robert C.Martin', 'https://blog.cleancoder.com/', 'The Clean Code Blog', 5);