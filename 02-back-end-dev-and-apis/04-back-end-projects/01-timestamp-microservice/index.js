
// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
require('dotenv').config();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
const { param } = require('../../02-basic-node-and-express/myApp');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api', (req, res) => {
  res.json({ unix: Date.now(), utc: new Date() })
})

app.get('/api/:date', (req, res) => {
  let paramDate = req.params.date;
  let intDate = parseInt(paramDate);
  console.log("intDate",intDate)

  let d = intDate < 10000 ? new Date(paramDate) : new Date(intDate);
  console.log("d",d);

  d.toString() === "Invalid Date"
    ? res.send({ error: "Invalid Date" }) 
    : res.json({ unix: Date.parse(d), utc: d.toUTCString() }) 
  }
)

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});