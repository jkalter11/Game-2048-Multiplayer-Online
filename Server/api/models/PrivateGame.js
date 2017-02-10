/**
 * Created by Administrator on 6/5/16.
 */
module.exports = {
  attributes: {
    players: {
      type: 'array'
    },
    app : {
      model: 'Game'
    },
    numberPlayers: {
      type: 'integer'
    },
    owner: {
      model: 'Player'
    },
    winner: {
      model: 'Player'
    },
    status: {
      type: 'string'
    }
  }
}
