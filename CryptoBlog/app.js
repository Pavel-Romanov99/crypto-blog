const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
//in order to check if someone is logged in we use sessions
const session = require('express-session')

app.use(session({ secret: 'notagoodsecret' }))

//set the views folder and set the view engine to ejs
const path = require('path')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//set the public folder so the pc knows where the styles are
app.use('/public', express.static(path.join(__dirname, 'public')))

//use ejs
const ejsMate = require('ejs-mate')
app.engine('ejs', ejsMate)

//express can read post request data
app.use(express.urlencoded({ extended: true }))

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

//connect to the database and check for errors
const Post = require('./models/postsModel')
const User = require('./models/user')

mongoose.connect('mongodb://localhost:27017/crypto', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('connected to database')
    })
    .catch((err) => {
        console.log('error connecting to db', err)
    })


//a function to check if the user is logged in
const loggedIn = (req, res, next) => {
    if (req.session.user_id == null) {
        res.redirect('/login')
    } else {
        next();
    }
}

//homepage route
app.get('/', loggedIn, async (req, res) => {

    const id = req.session.user_id;

    let coins = [];
    await rp(requestOptions).then(response => {
        for (var i = 0; i < response.data.length; i++) {
            coins.push(response.data[i].symbol)
            // console.log(response.data[i].symbol)
        }
    }
    ).catch((err) => {
        console.log('API call error:', err.message);
    });

    res.render('home', { coins, id })
})

//find all the post for the specific coin
app.get('/posts/:coin', loggedIn, async (req, res) => {
    const id = req.session.user_id;

    const posts = await Post.find({ coin: req.params.coin })
    const coinName = req.params.coin;
    res.render('posts', { posts, coinName, id })
})

//get request for a new post for the specific coin
app.get('/newpost/:coin', loggedIn, (req, res) => {
    const id = req.session.user_id;

    const coinName = req.params.coin;
    //we take the name of the coin from the url to make the post request to /newpost/coinName
    res.render('newpost', { coinName, id })
})

app.post('/newpost/:coin', loggedIn, async (req, res) => {
    //we take the name and description from the form
    const { description } = req.body;
    //take the username from the session
    const username = req.session.username;
    //we create a post object and save it 
    const post = new Post({ name: username, description: description, coin: req.params.coin })
    await post.save()
    res.redirect(`/posts/${req.params.coin}`)
})

//login and register routes
app.get('/register', (req, res) => {
    const id = req.session.user_id;

    res.render('register', { id })
})

app.post('/register', async (req, res) => {
    //we take the username and password from the form
    const { username, password } = req.body;

    //we check for some invalid forms
    if (!username || !password) {
        console.log('Cannot have empty fields')
    }
    if (password.length < 6) {
        console.log('Password has to be longer than 6 characters')
    }

    //we hash the password
    await bcrypt.hash(password, 12, async (err, hash) => {
        if (err) {
            console.log('Error hashing password!', err)
        } else {
            //if there is not error we create a new user the the hashed password
            const user = new User({
                username: username,
                password: hash
            })
            await user.save()
        }
    })
    res.redirect('/')
})

app.get('/login', (req, res) => {

    const id = req.session.user_id;
    res.render('login', { id })
})

app.post('/login', async (req, res) => {
    //we take the data from the from
    const { username, password } = req.body

    //we find a user from the database with the same username
    const user = await User.findOne({ username: username })

    //we check if the user exists
    if (!user) {
        res.send('there is not user with that username')
    }

    //we compare the form password and db password
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            console.log('error comparing passwords', err)
        } else {
            //if the passwords match
            if (result) {
                req.session.user_id = user._id
                req.session.username = user.username
                res.redirect('/')
            } else {
                //if the passwords don't match
                res.redirect('/login')
            }
        }
    })
})

//logout route and logic
app.post('/logout', (req, res) => {
    //removing the user from the session and redirecting
    req.session.user_id = null;
    req.session.username = null;

    res.redirect('/login')
})

app.listen(3000, () => {
    console.log('Listening on port 3000...')
})