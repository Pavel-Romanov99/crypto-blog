const express = require('express')
const app = express()
const rp = require('request-promise')


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
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
//in order to check if someone is logged in we use sessions
const session = require('express-session')
//we use flash for messages
const flash = require('connect-flash')
app.use(flash())

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

//connect to the database and check for errors
const Post = require('./models/postsModel')
const User = require('./models/user')
const Reply = require('./models/reply')
const Favourite = require('./models/favourites');
const { allowedNodeEnvironmentFlags } = require('process');



require("dotenv").config();
const dbURL = process.env.DB_URL || "mongodb://localhost:27017/crypto";


mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('connected to database')
    })
    .catch((err) => {
        console.log('error connecting to db', err)
    })

//we create global variables as middleware for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

//homepage route
app.get('/', async (req, res) => {

    const id = req.session.user_id;

    let coins = [];
    await rp(requestOptions).then(response => {
        for (var i = 0; i < response.data.length; i++) {
            coins.push(response.data[i].symbol)
        }
    }
    ).catch((err) => {
        console.log('API call error:', err.message);
    });

    res.render('home', { coins, id })
})

//find all the post for the specific coin
app.get('/posts/:coin', async (req, res) => {
    const id = req.session.user_id;
    const username = req.session.username;
    const posts = await Post.find({ coin: req.params.coin })
    const coinName = req.params.coin;
    const replies = await Reply.find({});
    const favourite = await Favourite.find({name: username, coin: coinName})
    const favourites = await Favourite.find({name: username})
    res.render('posts', { posts, coinName, id, username, replies, favourite, favourites })
})

//get request for a new post for the specific coin
app.get('/newpost/:coin', (req, res) => {
    const id = req.session.user_id;

    const coinName = req.params.coin;
    //we take the name of the coin from the url to make the post request to /newpost/coinName
    res.render('newpost', { coinName, id })
})

app.post('/newpost/:coin', async (req, res) => {
    //we take the name and description from the form
    const { description } = req.body;
    //take the username from the session
    const username = req.session.username;
    const id = (new Date()).getTime();
    //we create a post object and save it 
    const post = new Post({id:id, name: username, description: description, coin: req.params.coin })
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

    //error messages
    var errors = []

    //we check for some invalid forms
    if (!username || !password) {
        errors.push({ msg: 'Please fill in all fields' })
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password should be atleast 6 characters' })
    }

    if (errors.length > 0) {
        res.render('register', { errors, username, password })
    }

    //we check if there exists a user the same username
    User.findOne({ username: username }, async (err, existingUser) => {
        if (err) {
            console.log('error checking if user exists', err)
        } else {
            //if there is an existing user we redirect
            if (existingUser) {
                errors.push({ msg: 'Username is already registered' })
                if (errors.length > 0) {
                    res.render('register', { errors, username, password })
                }
            }
            else {
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
                            .then(() => {
                                req.flash('success_msg', 'Successfully registered!')
                                res.redirect('/login')
                            })
                            .catch((err) => {
                                console.log(err)
                            })

                    }
                })
            }
        }
    })
})

app.get('/login', (req, res) => {

    const id = req.session.user_id;
    res.render('login', { id })
})

app.post('/login', async (req, res) => {
    //we take the data from the from
    const { username, password } = req.body

    var errors = []

    //we find a user from the database with the same username
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log("error finding user");
        } else{
            //we check if the user exists
            if (!user) {
                errors.push({ msg: 'There is no user with that name' })
                res.render('login', { errors })
            }else {
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
                            req.flash('error_msg', 'Incorrect password')
                            res.redirect('/login')
                        }
                    }
                })
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

//delete a comment routes
app.post('/delete/:id', async (req, res) => {
    await Post.findOneAndDelete({ id: req.params.id })
        .then(() => {
            res.redirect(req.get('referer'));
        })
        .catch((err) => {
            console.log('error deleting comment', err)
        })
})

app.post('/delete/reply/:id', async (req, res) => {
    await Reply.findOneAndDelete({ id: req.params.id })
    .then(() => {
        res.redirect(req.get('referer'));
    })
    .catch((err) => {
        console.log('error deleting comment', err)
    })
})

app.post('/reply/:coin/:id', async (req, res) => {
    const {description} = req.body;
    const username = req.session.username;
    const replyId = (new Date()).getTime();

    const reply = new Reply({id: replyId, name: username, description: description, replyTo: req.params.id})
    await reply.save();
    res.redirect(req.get('referer'));

})

app.post('/favourite/:coin', async (req, res) => {
    const coin = req.params.coin;
    const username = req.session.username;

    const fav = new Favourite({name: username, coin: coin})
    await fav.save();
    res.redirect(req.get('referer'));
})

app.post('/favourite/delete/:coin', async (req, res) => {
    const coin = req.params.coin;
    const username = req.session.username;

    Favourite.findOneAndDelete({name: username, coin: coin})
    .then(() => {
        res.redirect(req.get('referer'));
    })
    .catch((err) => {
        console.log('error deleting favourite', err)
    })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
