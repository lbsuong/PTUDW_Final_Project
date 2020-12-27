const { add } = require('../utils/db');
const db = require('../utils/db');

const TBL_MODERATOR = 'moderator';

module.exports = {
  async singleByUsername(username) {
    const rows = await db.load(`SELECT * FROM ${TBL_MODERATOR} WHERE username = '${username}'`);
    if (rows.length == 0)
      return null;
    return rows[0];
  },

  add(entity) {
    return db.add(entity, TBL_MODERATOR);
  }
};