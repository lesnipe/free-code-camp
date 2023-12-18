let express = require('express');
let app = express();
let bodyParser = require('body-parser');
require('dotenv').config()

// 1 - Meet the Node console
console.log("Hello World");

// 7 - Implement a Root-Level Request Logger Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`)
    next();
})

// 11 - Use body-parser to Parse POST Requests
app.use(bodyParser.urlencoded({extended: false}));

// 2,3 - Start a Working Express Server & Serve an HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// 4 - Serve Static Assets
app.use('/public', express.static(__dirname + '/public'));

// 5,6- Serve JSON on a Specific Route & Use the .env File
app.get('/json', (req, res) => {
    let str;
    if(process.env.MESSAGE_STYLE === "uppercase") 
        str = "Hello json".toUpperCase()
    else
        str = "Hello json"
    res.json( {'message': str})
})

// 8 - Chain Middleware to Create a Time Server
app.get('/now', (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => {
    res.send({'time': req.time})
})

// 9 - Get Route Parameter Input from the Client
app.get('/:word/echo', (req, res) => {
    res.json({'echo': req.params.word})
})

// 10 - Get Query Parameter Input from the Client
app.get('/name', (req, res) => {
    let firstName = req.query.first;
    let lastName = req.query.last;
    res.json({'name': `${firstName} ${lastName}`})
})

// 12 - Get Data from POST Requests
app.post('/name', (req,res) => {
        let string = req.body.first+" "+req.body.last;
        res.json({name: string})
    })






























 module.exports = app;
