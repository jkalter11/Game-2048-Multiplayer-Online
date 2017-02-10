/**
 * Created by Administrator on 6/4/16.
 */
function updatePlayer(id) {
  Game
    .findOne({slug: id})
    .exec(function (err, g) {
      var plus = g.numberPlayers + 1;
      Game
        .update(id, {numberPlayers: plus})
        .exec(function (err, done) {

        })
    })
}
function updatePlays(id) {
  Game
    .findOne(id)
    .exec(function (err, g) {
      var plus = g.countPlays + 1;
      Game
        .update(id, {countPlays: plus})
        .exec(function (err, done) {

        })
    })
}

module.exports = {
  /*
   *
   * MANAGER GAME
   *
   * */
  'auth': function (req, res) {
    var pass = req.query.code;
    if (pass === '1234563') {
      req.session.auth = '1234563';
      res.redirect('/list-game')
    } else {
      res.ok('Auth failed');
    }
  },
  'create-game': function (req, res) {
    if (req.session.auth === '1234563' && req.body) {
      Game
        .create(req.body)
        .exec(function (err, created) {
          if (err) {
            res.err(err);
          } else {
            res.redirect('/view-game/' + created.id)
          }
        })
    } else {
      res.ok('Deny')
    }


  },
  'update-game': function (req, res) {
    if (req.session.auth === '1234563') {
      if (req.body.id) {
        Game
          .update(req.body.id, req.body)
          .exec(function (err, created) {
            if (err) {
              res.ok(err);
            } else {
              res.redirect('/list-game')
            }
          })
      } else {
        res.ok();
      }
    } else {
      res.ok('DENY')
    }
  },
  'view-game': function (req, res) {
    if (req.session.auth === '1234563') {
      var id = req.params.id;
      Game
        .findOne(id)
        .exec(function (err, game) {
          if (err) {
            res.ok(err);
          } else {
            res.view('viewGame', {game: game})
          }
        })
    } else {
      res.ok('Deny')
    }
  },
  'list-game': function (req, res) {
    var unremove = false;
    if (req.query.unremove) {
      var status = 0;
      unremove = true;
    } else {
      var status = 1;
    }
    if (req.session.auth === '1234563') {
      Game
        .find({status: status})
        .exec(function (err, datas) {
          if (err) {
            res.ok(err);
          } else {
            res.view('listgame', {games: datas, unremove : unremove})
          }
        })
    } else {
      res.ok('Deny')
    }
  },
  'delete-game': function (req, res) {
    var status = 0;
    if (req.query && req.query.status) {
      status = req.query.status;
    }
    if (req.session.auth === '1234563') {
      if (req.query.id) {
        Game
          .update(req.query.id, {status: status})
          .exec(function (err, created) {
            if (err) {
              res.err(err);
            } else {
              res.redirect('/list-game')
            }
          })
      } else {
        res.ok();
      }
    } else {
      res.ok('DENY')
    }
  },


  /*
   *
   * MAIN GAME
   *
   * */
  'home': function (req, res) {
    var page = req.query.page || 1;
    Game
      .find({status: 1})
      .paginate({page: page, limit: 20})
      .exec(function (err, result) {
        res.view('homepage', {games: result})
      })
  },
  'search': function (req, res) {
    var page = req.query.page || 1;
    if (req.query.q) {
      Game
        .find({status: 1, title: {'contains': req.query.q}})
        .paginate({page: page, limit: 20})
        .exec(function (err, result) {
          res.view('homepage', {games: result})
        })
    }
    if (req.query.s) {
      Game
        .find({title: {'contains': req.query.s}})
        .limit(5)
        .exec(function (err, data) {
          res.ok(data);
        })
    }
  },
  'new-player': function (req, res) {
    if(!req.body) {
      return res.ok();
    }
      var id = req.body.id;
    //console.log("ID:::", id);
      var private = req.body.private;
      if (id === 'no') {
        res.redirect('/');
      } else {
        Player
          .create({name: req.body.name})
          .exec(function (err, created) {
            updatePlayer(id);
            req.session.user = created;
            req.session.save();
            if (private === 'true') {
              res.redirect('/private/' + id);
            } else {
              res.redirect('/game/' + id);
            }
          })
      }

  },
  // PROGRESS GAME
  'stream': function (req, res) {
    if(!req.body) {
      return res.ok('');
    }
    var user = req.body.user,
      data = req.body.data,
      room = req.body.currentRom;
    //console.log("REQUEST stream:::", user, room);
    if (req.isSocket && user && data && room) {
      //console.log("[+] User - ROOM:::", user + ' - ' + room );
      sails.sockets.broadcast(room, room, {
        score: data.score,
        user: user,
        data: data
      });
      res.ok('OK');
    }
  },

  'join': function (req, res) {
    if(!req.body) {
      return res.ok('');
    }
    var room = req.body.room;
    //console.log("JOIN ROOM:", room);
    if (req.isSocket && room) {
      sails.sockets.join(req, room, function (err) {
        if (err) {
          return res.json({err: err, status: "Server bi qua tai"});
        } else {
          req.session.currentRom = room;
          return res.json({
            message: 'Subscribed to a fun room called room: ' + room,
            room: room
          });
        }
      });
    }
  },

  'play-game': function (req, res) {
    if(!req.body) {
      return res.ok('');
    }
    var id = req.body.id;
    //console.log("ID:::", id);
    // console.log("ID game:", id);
    if (req.isSocket && id) {
      updatePlays(id);
    }
    res.ok();
  },

  'game': function (req, res) {
    var slug = req.params.id;
    var user = req.session.user;
    // console.log("USER:::", user);

    Game
      .findOne({slug: slug})
      .exec(function (err, result) {
        if (result && result.id) {
          updatePlays(result.id);
        }
        if (err) {
          res.redirect('/');
        } else {
          if (result === undefined) {
            res.redirect('/')
          } else {
            res.view('game', {user: user, game: result, title: result.title})
          }
        }
      })
  },
  'capture': function (req, res) {
    var printscreen = require('mt-printscreen');
    var url = req.query.url;
    var name = req.query.name;
    if (!url || !name) {
      res.ok('');
    } else {
      printscreen(url, {
        timeout: 5000,
        format: 'png',
        dir: '.',
        fileName: name,
        quality: 85,
        capture: function () {

          var divs = document.querySelectorAll('div').length;

          return {
            divs: divs
          };
        }
      }, function (err, data) {
        require('fs').stat(data.file,function (err, stats) {
          res.ok({data: data, stats: stats})
        })
      })
    }
  },
  'share': function (req, res) {
  if(req.body) {
    saveGame
      .create(req.body)
      .exec(function (err, data) {
        saveGame
          .findOne(data.id)
          .populateAll()
          .exec(function (err, game) {
            res.view('share', {data: game})
          })

      })
  } else {
    var id = req.query.id;
    if(!id) {
      res.ok('');
    } else {
      saveGame
        .findOne(id)
        .exec(function () {
          
        })
    }

  }
    
  },


  /*
   *
   * PRIVATE GAME
   *
   * */

  'private-game': function (req, res) {
    var id = req.param('id');
    var user = req.session.user;

    PrivateGame
      .findOne(id)
      .populateAll()
      .exec(function (err, result) {
        if (err) {
          res.redirect('/');
        } else {
          res.view('private', {game: result, user: user});
        }
      })
  },

  'private-game-create': function (req, res) {
    if (req.body && req.body.owner === null) {
      res.redirect('/');
    } else {
      PrivateGame
        .create({
          app: req.body.app,
          numberPlayers: req.body.numberPlayers,
          owner: req.body.owner,
          status: 'wait'
        })
        .exec(function (err, created) {
          if (err) {
            res.redirect('/')
          }
          if (created) {
            res.redirect('/private/' + created.id)
          }
        })
    }
  },
  'private-game-over': function (req, res) {
    if (req.isSocket && req.method === 'POST') {
      if (req.session.currentRom) {
        sails.sockets.broadcast(req.session.currentRom, req.session.currentRom, {
          gameover: true,
          user: req.session.user
        });
      }
      res.ok();
    }
  },

  'private-start-game': function (req, res) {
    if (req.isSocket && req.method === 'POST' && req.body.start) {

      sails.sockets.broadcast(req.body.start, req.body.start, {startgamgame: true});
      res.ok();
    }
  },
  'logout': function (req, res) {
    if (req.session.user) {
      req.session.destroy();
      res.redirect('/')
    } else {
      res.ok('dont have user');
    }

  },

  'fixLink' : function(req, res) {
    Game.find().exec((e, r) => {
      r.forEach((v, k) => {
        let game = v;
        if (game && game.background) {
          game.background = game.background.replace('http://ohmyidol.com/', './');
        }
        if (game && game.thumb) {
          game.thumb = game.thumb.replace('http://ohmyidol.com/', './');
        }
        if (game && game.imagesInGame) {
          let imagesInGame = [];
          game.imagesInGame.forEach((v2, k2) => {          
            v2 = v2.replace('http://ohmyidol.com/', './');
            imagesInGame.push(v2);
          })          
          game.imagesInGame = imagesInGame;
        }
        Game.update(game.id, game).exec((e, updated) => {
          console.log("Updated :::", e, updated);
        });
      })
      res.ok("Done");
    })
  }
}
