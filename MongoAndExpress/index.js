const express = require('express');
const app = express();
const path = require('path');
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


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/dog', (req, res) => {
    res.send("WOOF");
})


app.get('/products', async (req, res) => {
    const products = await product.find({})
    console.log(products)
    res.render('products/index.ejs', { products })
})

app.get('/product/:id', async (req, res) => {
    const { id } = req.params;
    const product1 = await product.findById(id)
    console.log(product1)
    res.render('products/show', { product1 })
})

app.listen(3000, () => {
    console.log("Listening on port 3000..")
})