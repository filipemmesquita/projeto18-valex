import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import router from './routers/router'

config();

const server = express();
server.use(cors());
server.use(express.json());
server.use(router);

server.listen(process.env.PORT, () => {
    console.log(`Server listening at ${process.env.PORT}...`);
});

