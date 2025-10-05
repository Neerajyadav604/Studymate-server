const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// tell passport how to serialize user info into session
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// register the Google strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,       // from Google Cloud Console
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/api/v1/auth/google/callback" // must match your Google Console config
  },
  (accessToken, refreshToken, profile, done) => {
    // this function is called after Google sends back user info
    // you can save the user to DB here
    return done(null, profile);
  }
));
