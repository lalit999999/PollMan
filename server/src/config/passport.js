import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import env from "../config/env.js";
import { User } from "../models/index.js";

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${env.BACKEND_URL}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { id, displayName, emails, photos } = profile;
                const email = emails?.[0]?.value;
                const avatar = photos?.[0]?.value;

                if (!email) {
                    return done(new Error("No email found in Google profile"));
                }

                let user = await User.findOne({ googleId: id });

                if (!user) {
                    user = await User.findOne({ email });

                    if (user) {
                        user.googleId = id;
                        user.name = displayName || user.name;
                        user.avatar = avatar || user.avatar;
                    } else {
                        user = new User({
                            email,
                            name: displayName || email.split("@")[0],
                            googleId: id,
                            avatar,
                        });
                    }

                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        },
    ),
);

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
