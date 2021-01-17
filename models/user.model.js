const db = require('../utils/db');
const config = require('../config/default.json');

const TBL_USERS = 'users';
const PRI_KEY = 'username';

module.exports = {
  async singleByUsername(username) {
    const rows = await db.load(`SELECT * FROM ${TBL_USERS} WHERE username = '${username}'`);
    if (rows.length == 0)
      return null;
    return rows[0];
  },

  add(entity) {
    return db.add(entity, TBL_USERS);
  },

  changePassword(newPass, id) {
    return db.update(newPass, 'password', PRI_KEY, id, TBL_USERS);
  },

  changePicture(newPic, id) {
    return db.update(newPic, 'picture', PRI_KEY, id, TBL_USERS);
  },

  async countOnUser() {
    const result = await db.load(`SELECT COUNT(*) AS total FROM ${TBL_USERS}`);
    if (result.length === 0) {
      return null;
    }
    return result[0].total;
  },

  pageOnUser(offset) {
    return db.load(
      `SELECT *
      FROM ${TBL_USERS}
      LIMIT ${config.paginationOnUser.limit} OFFSET ${offset}`);
  },

  changeProfile(newEntity) {
    const condition = { username: newEntity.username };
    return db.patch(newEntity, condition, TBL_USERS);
  },

  deleteAccount(username) {
    const condition = { username: username };
    return db.del(condition, TBL_USERS);
  },

  disableAccount(username) {
    const condition = { username: username };
    const entity = {
      disable: true
    };
    return db.patch(entity, condition, TBL_USERS);
  },

  enableAccount(username) {
    const condition = { username: username };
    const entity = {
      disable: false
    };
    return db.patch(entity, condition, TBL_USERS);
  }
};