import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
//import session from 'express-session';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// configure templating to hbs
app.set('view engine', 'hbs');

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));


//homepage on the web 
app.get('/', (req, res) => {
    
    res.render('game');

});

app.listen(process.env.PORT || 3000);

console.log('server started');
