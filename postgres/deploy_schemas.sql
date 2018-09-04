-- Deploy fresh database tables

\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'
\i '/docker-entrypoint-initdb.d/tables/incomeitem.sql'
\i '/docker-entrypoint-initdb.d/tables/expenseitem.sql'


\i '/docker-entrypoint-initdb.d/tables/seed.sql'

