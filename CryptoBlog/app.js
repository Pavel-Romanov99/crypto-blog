const express = require('express')
const app = express()
const path = require('path')
app.use('/public', express.static(path.join(__dirname, 'public')))
const mongoose = require('mongoose')

//getting the top 10 cryptos
const rp = require('request-promise');
const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
        'start': '1',
        'limit': '10',
        'convert': 'USD'
    },
    headers: {
        'X-CMC_PRO_API_KEY': '7ac4f7f1-d9d9-4de8-85a4-03052b31cd85'
    },
    json: true,
    gzip: true
};

rp(requestOptions).then(response => {
    for (var i = 0; i < response.data.length; i++) {
        console.log(response.data[i].name)
    }
}
).catch((err) => {
    console.log('API call error:', err.message);
});
//

app.use(express.urlencoded({ extended: true }))


//connect to the database and check for errors
mongoose.connect('mongodb://localhost:27017/crypto', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected')
})

const views = path.join(__dirname, '/views')

//basic routes
app.get('/', (req, res) => {
    res.sendFile(`${views}/home.html`)
})

app.listen(3000, () => {
    console.log('Listening on port 3000...')
})