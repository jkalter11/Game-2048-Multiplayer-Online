'use strict';

var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    request = require('request');


var verifyHandler = function(req, token, tokenSecret, profile, done) {

  process.nextTick(function() {
    var url = 'https://graph.facebook.com/v2.4/me?access_token=%s&fields=id,name,email,first_name,last_name,gender';
    url = url.replace('%s', token);

    var options = {method: 'GET', url: url, json: true};
    request(options, function (err, response) {
      if (err) {
        return done(null, null);
      }

      var data = {
        id: response.body.id,
        first_name: response.body.first_name,  //jshint ignore:line
        last_name: response.body.last_name,    //jshint ignore:line
        email: response.body.email,
        gender: response.body.gender
      };

      return done(null, data);
    });
  });
};

passport.use(new FacebookStrategy({
  clientID: '1139613872746625',
  clientSecret: 'af5f26878a55d4f94b5b5683076ed288',
  callbackURL: 'http://localhost:1337/facebook/callback',
  passReqToCallback: true
}, verifyHandler));
