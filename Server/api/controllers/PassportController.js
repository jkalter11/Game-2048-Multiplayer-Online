'use strict';

var passport = require('passport');

module.exports = {


  facebookAuth: function(req, res, next) {
    passport.authenticate('facebook', { scope: ['email', 'user_about_me']})(req, res, next);
  },

  facebookCallback: function(req, res, next) {
    passport.authenticate('facebook', function(err, user) {
      res.json(user);
    })(req, res, next);
  },

  logout: function (req, res) {
    req.session.user = null;
    req.session.flash = 'You have logged out';
    res.redirect('/');
  }
}
