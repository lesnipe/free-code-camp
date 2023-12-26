const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

// Connect to db
try {
  mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
}
catch (err) {
  console.log(err)
}

// User schema
const userSchema = new mongoose.Schema({
  username: {type: String, required: true}
}, { versionKey: false });

// Exercise schema
const exerciseSchema = new mongoose.Schema({
  user_id: {type: String, required: true},
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: {type: Date, default: new Date()},
}, { versionKey: false });

// User model
const User = mongoose.model('user', userSchema);

// Exercise model
const Exercise = mongoose.model('exercise', exerciseSchema);

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', (req, res) => {
  User.find({})
      .exec((err, allUsers) => {
      if(err) res.json({ error: err })
      res.json(allUsers)
  })
})

app.get('/api/users/:_id/logs', async (req, res) => {
  const id = req.params._id;
  const {from, to, limit} = req.query;
  
  // find user from db
  const foundUser = User.findById(id);
  if(!foundUser) return res.json({ error: 'user not found in db..' });
  
  // Add search options
  let options = {user_id: id}
  let dateOptions = {}
  if(from) dateOptions["$gte"] = new Date(from)
  if(to) dateOptions["$lte"] = new Date(to)
  if(from || to) options.date = dateOptions
  
  // Find exercises from db with options according to limit query
  let foundExercises;
  limit ? foundExercises = await Exercise.find(options).limit(+limit)
        : foundExercises = await Exercise.find(options);
 
  // Map exercises to the desired format 
  let log = [];
  foundExercises.map((ex) => {
    log.push({
      description: ex.description,
      duration: ex.duration,
      date: ex.date.toDateString()
    })
  })

  // Final response
  res.json({
    username: foundUser.username,
    count: foundExercises.length,
    _id: foundUser._id,
    log
  })

})

app.post('/api/users', (req,res) => {
  User.create({username: req.body.username}, (err, createdUser) => {
    if(err) res.json({error: err})
    res.json({username: createdUser.username, _id: createdUser._id})
  })
})

app.post('/api/users/:_id/exercises', async (req, res) => {
  const id = req.params._id;
  const {description, duration, date} = req.body;
  
  // find id from db
  const foundUser = await User.findById(id, (err) => console.log(err));
  
  // add exercise in db
  Exercise.create({
    user_id: foundUser._id,
    description: description,
    duration: duration,
    date: date ? new Date(date) : new Date()
  }, (err, createdExercise) => {
    if(err) res.json({ error: err });
    res.json({
      _id: foundUser._id,
      username: foundUser.username,
      date: createdExercise.date.toDateString(),
      duration: createdExercise.duration,
      description: createdExercise.description
    });
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
