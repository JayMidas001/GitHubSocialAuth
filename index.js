const express = require(`express`)
const passport = require(`passport`)
const GitHubStrategy = require(`passport-github2`).Strategy
const session = require(`express-session`)
const router = require('./router/userRouter.js')
require('./config/dbConfig.js')

const port = process.env.port || 1199

const app = express()
app.use(express.json())
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.session_secret,
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true }
}))


passport.use(new GitHubStrategy({
    clientID: process.env.GitHub_clientID,
    clientSecret: process.env.GitHub_clientSecret,
    callbackURL: process.env.GitHub_callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
      console.log('Callback function executed');
      return done(null, profile);
  }
));



// Serialize user into the sessions
passport.serializeUser((user, done) => {
    // console.log('Serializing user:', user._json);
     done(null, user); // Storing only user ID in session
   });
   
   // Deserialize user from the sessions
passport.deserializeUser((user, done) => {
     console.log('Deserializing user:', user);
     done(null, user);
   });
   
app.use(passport.initialize())
app.use(passport.session())


app.use('/api/v1/', router)

app.listen(port, () => {
    console.log(`server running on PORT: ${port}`);
})