const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const isSignedIn=require('./middleware/is-signed-in');
const passUserToView =require('./middleware/pass-user-to-view');
const MongoStore = require("connect-mongo");

require('./config/database');

// Controller imports
const authCtrl = require('./controllers/auth');
const passUserToView = require('./middleware/pass-user-to-view');

const app = express();

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

// MIDDLEWARE
app.use(methodOverride("_method"));
app.use(morgan('dev'));
// new
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URI,
      }),
    }));

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride('_method'));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

app.use(passUserToView)
// ROUTES
app.use('/auth', authCtrl);

app.get("/vip-lounge", isSignedIn,(req, res) => {
    if (req.session.user) {
      res.send(`Welcome to the party ${req.session.user.username}.`);
    } else {
      res.send("Sorry, no guests allowed.");
    }
  });   

app.get('/', (req, res, next) => {
    const user = req.session.user;
  res.render('index.ejs',{user});
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});