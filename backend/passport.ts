import { Strategy as GitHubStrategy } from 'passport-github2';
import passport from 'passport';
import User from './Models/user.models.js';  
passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID!,//to tell ts that the credentials are there
    clientSecret: process.env.CLIENT_SECRET!,
    callbackURL:"http://localhost:4000/auth/github/callback",
    scope: ['repo' ],
    customHeaders: {
     "User-Agent": "OpenSource helper"
  },
  
  
  },
  async (accessToken: string,refreshToken:string, profile: any, done: any) => {
    try {
        //console.log("NEW TOKEN ARRIVED:", accessToken.substring(0, 10) + "...");
      const user = await User.findOneAndUpdate(
        { githubId: profile.id }, 
        { 
          username: profile.username,
          avatarUrl: profile._json.avatar_url,
          accessToken: accessToken  
        },
        { upsert: true, new: true }
      );
      console.log("DATABASE CONFIRMATION:",User ?"Token Saved" : "TOKEN FAILED TO SAVE");

      return done(null, user);  
    } catch (err) {
      return done(err, null);
    }
  }
));
passport.serializeUser((user: any, done) => {
  console.log("Serializing user:", user.id || user._id);
  done(null, user.id || user._id);
});

// 2. DESERIALIZE: Uses the ID from the session to find the full user in the DB.
// This runs on every request AFTER login to populate 'req.user'.
passport.deserializeUser(async (id: string , done) => {
  try {
    console.log("Deserializing user ID:", id);
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error("Deserialization error:", err);
    done(err, null);
  }
});