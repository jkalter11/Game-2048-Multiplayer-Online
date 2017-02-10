/**
 * Created by Administrator on 6/15/16.
 */
module.exports = {
  'updatePlayer': function (id) {
    Game
      .findOne(id)
      .exec(function (err, g) {
        var plus = g.numberPlayers + 1;
        Game
          .update(id, {numberPlayers: plus})
          .exec(function (err, done) {
            (err) ? console.log(err) : '';
          })
      })
  },
  'updatePlays': function (id) {
    Game
      .findOne(id)
      .exec(function (err, g) {
        var plus = g.countPlays + 1;
        Game
          .update(id, {countPlays: plus})
          .exec(function (err, done) {
            (err) ? console.log(err) : done;
          })
      })
  },

};
