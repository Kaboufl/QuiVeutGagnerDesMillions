import { Knex } from 'knex';

declare module 'knex' {
    interface User {
        id: number,
        name: string
    }

    interface Tables {
        users: User;

        users_composite: Knex.CompositeTableType<
            User,
            Pick<User, 'name'>,
            Partial<Omit<User, 'id'>>
        >;
    }
}