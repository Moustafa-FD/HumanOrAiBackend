import express from 'express';
import bodyParser from 'body-parser';
import { Router } from 'express';
import { getTicket, ticketStatus } from './routes/regularGameRoute.ts';


const app = express();
const PORT = 5000
const routes = Router();

app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send('Hello to Human or AI Backend');
});

app.use(routes);

routes.route('/ticket/:userID').get(getTicket);
routes.route('/ticketstat/:ticketId').get(ticketStatus);


app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));