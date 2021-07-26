const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/movieApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected!")
    })
    .catch(err => {
        console.log("Error with connection")
        console.log(err)
    })

//create schema
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
});

//create a model and a movie object
const Movie = mongoose.model('Movie', movieSchema);
const game = new Movie({ title: 'The Game', year: 1967, score: 9.1, rating: 'R' });

//saved into the database we are using
game.save()

//add multiple movies - auto saves
Movie.insertMany([
    { title: 'Fight Club', year: 1991, score: 9.1, rating: 'R' },
    { title: 'Troy', year: 2000, score: 8.2, rating: 'R' },
    { title: 'Once upon a time in Holywood', year: 2019, score: 9.5, rating: 'R' },
    { title: 'The Simpsons Movie', year: 2013, score: 6.8, rating: 'R' },
])
    .then(data => {
        console.log(data)
        console.log("it worked!")
    })
    .catch(err => {
        console.log(err)
        console.log('there was an error!')
    })
