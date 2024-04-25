const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const session = require('express-session');
require('dotenv').config();
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;
var path = require('path');

app.use(express.static('views'));

app.use(express.static(path.join(__dirname, 'public')));

// Passport configuration
passport.use(new OAuth2Strategy({
    authorizationURL: 'https://sandbox-api.dexcom.com/v2/oauth2/login',
    tokenURL: 'https://sandbox-api.dexcom.com/v2/oauth2/token',
    clientID: process.env.DEXCOM_CLIENT_ID,
    clientSecret: process.env.DEXCOM_CLIENT_SECRET,
    callbackURL: "http://diabeazy.uk.r.appspot.com/auth/dexcom/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // In a production app, you might store these tokens in the user's session
    return cb(null, { accessToken, refreshToken });
  }
));

app.use(passport.initialize());

app.set('view engine', 'ejs');
app.use(
  session({
    secret: 'secret', // You should use a real secret in production
    resave: false,
    saveUninitialized: true,
  })
);
// Serialize user session
passport.serializeUser(function (user, done) {
  done(null, user);
});

// Deserialize user session
passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Express application routes
app.get('/', (req, res) => {
  console.log(req.user);
  res.render('index', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/auth/dexcom', passport.authenticate('oauth2'));

app.get(
  '/auth/dexcom/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  async function (req, res) {
    // Successful authentication
    const accessToken = req.user.accessToken;
    const refreshToken = req.user.refreshToken; 
    let evgsData  = await getEvgsData(accessToken);
    let myList = [];
    console.log(evgsData);
    evgsData.records.forEach(record => {
      console.log(record.value);
      myList.push(record.value);
    });
    console.log(myList);

    // Calculate average
    const average = calculateAverage(myList);
    
    res.render('dataAnalysis', { data1: myList, average: average }); // Pass average to the view

    console.log(req.user);

    //res.redirect('/');
  }
);

app.get('/home', (req, res) => {
  res.render('home');
});
// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

async function getEvgsData(accessToken) {
  const query = new URLSearchParams({
    startDate: '2022-02-07T00:00:00',
    endDate: '2022-02-08T00:00:00'
  }).toString();
  
  const resp = await fetch(
    `https://sandbox-api.dexcom.com/v3/users/self/egvs?${query}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  
  return resp.json();
}

// Function to calculate the average
function calculateAverage(data) {
  const sum = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const average = Math.floor(sum / data.length);
  return average;
}
