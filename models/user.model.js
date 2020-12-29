const db = require('../utils/db');

const TBL_USERS = 'users';

module.exports = {
  async singleByUsername(username) {
    const rows = await db.load(`SELECT * FROM ${TBL_USERS} WHERE username = '${username}'`);
    if (rows.length == 0)
      return null;
    return rows[0];
  },

  add(entity){
    return db.add(entity, TBL_USERS);
  },

};