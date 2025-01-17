import express, {Request, Response} from 'express';
import knex from 'knex';
import cors from 'cors';

import { db } from './db/db';

const app = express();
const port = 3000;

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}

app.get('/', cors(), (req: Request, res: Response) => {
    res.json({ message: `Hello World!` });    
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})