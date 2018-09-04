BEGIN TRANSACTION;

CREATE TABLE users (
    userid SERIAL PRIMARY KEY, 
    name VARCHAR(100),
    email text UNIQUE,
    totalincome BIGINT DEFAULT 0,
    totalexpense BIGINT DEFAULT 0
);

COMMIT;