let mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number,
  favoriteFoods: [String]
});

let Person = mongoose.model('Person', personSchema);

let arrayOfPeople = [ 
  {
    name: 'Doe',
    age: 25,
    favoriteFoods: ['fries', 'cereals']
  },
  {
    name: 'Joe',
    age: 22,
    favoriteFoods: ['pizza', 'pasta']
  }
]

const createAndSavePerson = (done) => {
  let newPerson = new Person({
    name: 'Joe',
    age: 22,
    favoriteFoods: ['pizza', 'pasta']
  });
  newPerson.save((err, data) => {
    if(err) return console.log(err)
    done(null, data);
  });
  
};

const createManyPeople = (arrayOfPeople, done) => {
  let final = [];
  arrayOfPeople.map((obj) => {
    final.push(new Person(obj))
  })
  Person.create(final, (err,data) => {
    if(err) return console.log(err)
    done(null, data);
  });

};

const findPeopleByName = (personName, done) => {
  Person.find(
    {name: personName}, 
    (err, data) => {
      if (err) return console.log(err); 
      done(null, data);
    })
};

const findOneByFood = (food, done) => {
  Person.findOne(
    {favoriteFoods: food},
    (err, data) => {
      if (err) return console.log(err); 
      done(null, data);
    }
  )
};

const findPersonById = (personId, done) => {
  Person.findById(personId,(err, data) => {
      if (err) return console.log(err); 
      done(null, data);
    }
  )
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, (err, data) => {
    if(err) console.log(err);
    data.favoriteFoods.push(foodToAdd);
    data.save((err, updatedData) => {
      if(err) return console.log(err)
      done(null, updatedData)
    });
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, (err, data) => {
    if(err) return console.log(err)
    done(null, data)
  }, 
  {new: true})
};

const removeById = (personId, done) => {
  Person.findByIdAndDelete(personId, (err, data) => {
    if(err) return console.log(err)
    done(null, data)
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, data) => {
    if(err) return console.log(err)
    done(null, data)
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods: foodToSearch})
    .sort({name: 1})
    .limit(2)
    .select({age: 0})
    .exec((err, data) => {
      if(err) return console.log(err);
      done(null, data)
      })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
