import express from 'express';
import bodyParser from 'body-parser';
import { Router } from 'express';
import { getTicket, ticketStatus } from './routes/regularGameRoute.ts';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from "socket.io";
import { chatRoomManager } from './gameManagment/chatRoomManager.ts';
dotenv.config();

const server = createServer();
const io = new Server(server, {
    cors: { origin: "*" }
});

const app = express();
const routes = Router();

app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send('Hello to Human or AI Backend');
});

app.use(routes);

routes.route('/ticket/:userID').get(getTicket);
routes.route('/ticketstat/:ticketId').get(ticketStatus);


chatRoomManager(io);

server.listen(process.env.PORT2);
app.listen(process.env.PORT, () => console.log(`Server running on port: http://localhost:${process.env.PORT}`));