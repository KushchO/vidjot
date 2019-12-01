const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//DB Config
const db = require('./config/database');

// Connect to mongoose
mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

//Handlebars midlleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Method override middleware
app.use(methodOverride('_method'));

//Express session midleware
const store = new MongoDBStore({
  uri: db.mongoURI,
  collection: 'mySessions'
});
app.use(
  session({
    store: store,
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//Passport midlewares
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//index Route
app.get('/', (req, res) => {
  const title = 'Welcome!!!';
  res.render('index', { title: title });
});

//about Route
app.get('/about', (req, res) => {
  console.log(req.name);
  res.render('about');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);
