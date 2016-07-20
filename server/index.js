// EXTERNAL MODULES //
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');


// CONFIG //
var config = require('./config');

// CONTROLLERS //
var UserCtrl = require('./controllers/UserCtrl');

// SERVICES //
var passport = require('./services/passport');


// POLICIES //
var isAuthed = function(req, res, next) {
  if (!req.isAuthenticated()) return res.status(401).send();
  return next();
};




// EXPRESS //
var app = express();

app.use(express.static(__dirname + './../public'));
app.use(bodyParser.json());

// Session and passport
app.use(session({
  secret: config.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());



// GOOGLE AUTHENTICATE ENDPOINTS //

app.get('/auth/google',
  passport.authenticate('google', { successRedirect: '/me',scope:
      [ 'email', 'profile' ]
     }));

 
app.get( '/auth/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/me',
        failureRedirect: '/login'
}));

// USER ENDPOINTS //
app.post('/register', UserCtrl.register);
app.get('/login', UserCtrl.read);
app.get('/me', isAuthed, UserCtrl.me);
app.put('/user/:_id', isAuthed, UserCtrl.update);


// CONNECTIONS //

 var port = config.PORT;


  app.listen(port, function() {
    console.log('Listening on port '+ port);
  });

