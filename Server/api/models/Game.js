/**
 * Created by Administrator on 6/5/16.
 */
module.exports = {
  attributes: {
    title: {
      type: 'string',
      required: true
    },
    slug: {
      type: 'string',
    },
    imagesInGame: {
      type: 'array',
      required: true
    },
    author: {
      model: 'Player'
    },
    background: {
      type: 'string'
    },
    thumb: {
      type: 'string'
    },
    bestPlayers: {
      type: 'array'
    },
    countPlays: {
      type: 'integer',
      defaultsTo: 0
    },
    numberPlayers: {
      type: 'integer',
      defaultsTo: 0
    },
    status: {
      type: 'integer',
      defaultsTo: 0 // 0: unActive, 1: active  , 2: delete
    }
  }
}
