const db = require('../utils/db');

const TBL_LECTURER = 'lecturer';

module.exports = {
  async singleByUsername(username) {
    const rows = await db.load(`SELECT * FROM ${TBL_LECTURER} WHERE username = '${username}'`);
    if (rows.length == 0)
      return null;
    return rows[0];
  }
};