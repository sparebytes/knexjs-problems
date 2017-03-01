import * as Knex from 'knex';

const knexOptions: Knex.Config = {
    client: 'pg',
    connection: {
        "host": "localhost",
        "port": 5432,
        "user": "xxxxxxxxxxxxx",
        "password": "xxxxxxxxxxxxx",
        "database": "xxxxxxxxxxxxx",
        "ssl": false,
    },
    debug: false,
};

export const knex = Knex(knexOptions);