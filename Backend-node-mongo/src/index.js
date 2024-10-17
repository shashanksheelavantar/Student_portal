import dotenv from 'dotenv';
dotenv.config({ path: './.env.sample' }); 
import connectDB from './db/db.js';
import express, { json } from 'express';
const app = express();
app.use(json());
const PORT = process.env.PORT || 8000;

// connectDB();

app.listen(PORT, () => {
    console.log(`The server started on port ${PORT}`);
});
