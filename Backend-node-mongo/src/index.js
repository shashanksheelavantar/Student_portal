import dotenv from 'dotenv';
dotenv.config({ path: './.env.sample' }); 
import {db} from './db/db.js';
import {app} from "./app.js"



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`The server started on port ${PORT}`);
});
