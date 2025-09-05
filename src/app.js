import express from 'express';
import bodyParser from 'body-parser';
import { Router } from 'express';


const app = express();
const PORT = 5000

app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));

app.get('/', (req, res) => {
    res.send('Hello to Human or AI Backend');
});