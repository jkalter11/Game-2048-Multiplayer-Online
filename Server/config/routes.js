/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  // MANAGER
  '/auth': {
    controller: 'PlayerController',
    action: 'auth'
  },
  '/create-game': {
    view: 'createGame',
    skipAssets: true,
    locals: {
      layout: 'layout-manager'
    }
  },
  '/update-game': {
    controller: 'PlayerController',
    action: 'create-game',
    skipAssets: true,
    locals: {
      layout: 'layout-manager'
    }
  },
  '/view-game/:id': {
    controller: 'PlayerController',
    action: 'view-game',
    skipAssets: true,
    locals: {
      layout: 'layout-manager'
    }
  },
  '/list-game': {
    controller: 'PlayerController',
    action: 'list-game',
    skipAssets: true,
    locals: {
      layout: 'layout-manager'
    }
  },

  // GAME
  '/': {
    controller: 'PlayerController',
    action: 'home',
    locals: {
      layout: 'layout-home'
    }
  },
  'POST /private-game-create': {
    controller: 'PlayerController',
    action: 'private-game-create'
  },
  'GET /game/:id': {
    controller: 'PlayerController',
    action: 'game',
    skipAssets: true
  },
  'GET /search': {
    controller: 'PlayerController',
    action: 'search',
    skipAssets: true
  },
  'GET /private/:id': {
    controller: 'PlayerController',
    action: 'private-game',
    skipAssets: true
  },
  'GET /facebook': {
    controller: 'PassportController',
    action: 'facebookAuth'
  },
  'GET /facebook/callback': {
    controller: 'PassportController',
    action: 'facebookCallback'
  },
  'GET /logout': {
    controller: 'PlayerController',
    action: 'logout'
  }

  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

};
