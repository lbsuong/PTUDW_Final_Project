const { add } = require('../utils/db');
const db = require('../utils/db');

const TBL_ADMIN = 'admin';

module.exports = {
  async singleByUsername(username) {
    const rows = await db.load(`SELECT * FROM ${TBL_ADMIN} WHERE username = '${username}'`);
    if (rows.length == 0)
      return null;
    return rows[0];
  },

  add(entity) {
    return db.add(entity, TBL_ADMIN);
  }
};