import express from 'express';
import bodyParser from 'body-parser';
import { Router } from 'express';
import { getTicket, ticketStatus, getMode2Ticket, getMode2TicketStatus } from './routes/regularGameRoute.ts';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from "socket.io";
import { chatRoomManager } from './gameManagment/chatRoomManager.ts';
import cors from 'cors'
dotenv.config();

const server = createServer();
const io = new Server(server, {
    cors: {     
        origin: process.env.FRONTEND_ADDRESS ,
        methods: ["GET", "POST"]
     }
});

const app = express();
const routes = Router();

app.use(cors({
    origin: process.env.FRONTEND_ADDRESS ,
    methods: ["GET", "POST"]
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello to Human or AI Backend');
});

app.use(routes);

routes.route('/ticket/:userId').get(getTicket);
routes.route('/ticketstat/:ticketId').get(ticketStatus);
routes.route('/ticket/mode2/:userId').get(getMode2Ticket);
routes.route('/ticketstat/mode2/:ticketId').get(getMode2TicketStatus)


chatRoomManager(io);

server.listen(Number(process.env.PORT2), "0.0.0.0");
app.listen(Number(process.env.PORT), "0.0.0.0", () => console.log(`Server running on port: http://localhost:${process.env.PORT}`));