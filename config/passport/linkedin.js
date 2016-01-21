'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const LinkedinStrategy = require('passport-linkedin').Strategy;
const config = require('../config');
const User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new LinkedinStrategy({
    consumerKey: config.linkedin.clientID,
    consumerSecret: config.linkedin.clientSecret,
    callbackURL: config.linkedin.callbackURL,
    profileFields: ['id', 'first-name', 'last-name', 'email-address']
  },
  function (accessToken, refreshToken, profile, done) {
    const options = {
      criteria: { 'linkedin.id': profile.id }
    };
    User.load(options, function (err, user) {
      if (err) return done(err);
      if (!user) {
        const username = profile.username? profile.username : profile.displayName.replace(' ','');
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: username,
          provider: 'linkedin',
          linkedin: profile._json
        });
        user.save(function (err) {
          if (err) console.log(err);
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
  }
);
