/**
 * Created by Administrator on 6/5/16.
 */
module.exports = {
  attributes: {
    name: {
      type: 'string'
    },
    facebookId: {
      type: 'string',
      unique: true
    }
  }
}
