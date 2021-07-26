//we do modifications in this file
//so that we dont have to use express and mongo together

const mongoose = require('mongoose')

const product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connected!")
    })
    .catch(err => {
        console.log("Error with mongo connection")
        console.log(err)
    })

const p = new product({
    name: 'Grapefruit',
    price: 1.99,
    category: 'fruit'
})

p.save()
    .then(data => {
        console.log(data)
    })
    .catch(err => {
        console.log(err)
    })

product.insertMany([
    {
        name: 'Strawberry',
        price: 3,
        category: 'fruit'
    },
    {
        name: 'Melon',
        price: 2.5,
        category: 'fruit'
    },
    {
        name: 'Tomato',
        price: 1.75,
        category: 'vegetable'
    }
])
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })