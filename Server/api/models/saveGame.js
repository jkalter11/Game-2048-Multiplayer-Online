/**
 * Created by Administrator on 6/17/16.
 */
module.exports = {
  attributes: {
    score: {
      type: 'string'
    },
    data: {
      type: 'string'
    },
    player: {
      model: 'Player'
    },
    game: {
      model: 'Game'
    }
  }
};
